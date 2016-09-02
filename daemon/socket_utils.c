#include "socket_utils.h"

extern const int MAX_CLIENTS;

int populate_fd_set(fd_set* fdset, int initial_fd, int* arr) {
	/* Empty the fd set */
	FD_ZERO(fdset);
	/* Add the master socket to the set */
	FD_SET(initial_fd, fdset);

	/* Initialize max fd as sockfd */
	int highest_fd = initial_fd;

	/* Add all active connections to the fd set */
	for (int i = 0; i < MAX_CLIENTS; ++i) {
		if (arr[i] != -1) {
			FD_SET(arr[i], fdset);
			if (arr[i] > highest_fd) highest_fd = arr[i];
		}
	}

	return highest_fd;
}

int wait_for_data(fd_set* fdset, int highest) {
	int retval;
	if ((retval = select(highest, fdset, NULL, NULL, NULL)) == -1)
		perror("select");
	return retval;
}

void check_sockets(int master_fd, fd_set* fdset, int* clients, usb_dev_handle* usb_handle) {
	if (socket_has_data(master_fd, fdset))
		handle_master_socket(master_fd, clients);
	/* Check all open connections */
	handle_client_sockets(fdset, clients, usb_handle);
}

void handle_master_socket(int master_fd, int* clients) {
	struct sockaddr_in client;
	int len = sizeof(client), connfd;

	connfd = accept(master_fd, (struct sockaddr*)&client, (socklen_t*)&len);

	int index = add_to_store(connfd, clients);

	/* No space for it */
	if (index < 0) {
		printf("Too many connections, disconnecting.\n");
		disconnect_client(clients, index);
	}
}

void handle_client_sockets(fd_set* fdset, int* clients, usb_dev_handle* usb_handle) {
	for (int i = 0; i < MAX_CLIENTS; ++i) {
		if (socket_has_data(clients[i], fdset))
			check_client(i, clients, usb_handle);
	}
}

void check_client(int i, int* clients, usb_dev_handle* usb_handle) {
	char buf[8];
	int retval;

	if((retval = read(clients[i], buf, sizeof(buf))) == 0) {
		disconnect_client(clients, i);
		printf("Closing connection.\n");
	} else
		handle_data(buf, retval, usb_handle);
}

void handle_data(char* data, int length, usb_dev_handle* usb_handle) {
	for (int i = 0; i < length; i += sizeof(packet))
		send_usb_packet((packet*)(data+i), usb_handle);
}

int add_to_store(int connfd, int* arr) {
	int i = find_free_slot(arr);
	if (i >= 0) {
		arr[i] = connfd;
		printf("Accepted connection.\n");
	}
	return i;
}

int find_free_slot(int* arr) {
	for (int i = 0; i < MAX_CLIENTS; ++i) {
		if (arr[i] == -1) return i;
	}
	return -1;
}

void disconnect_client(int* clients, int i) {
	close(clients[i]);
	if (i >= 0) clients[i] = -1;
}
