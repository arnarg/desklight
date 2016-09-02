#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/stat.h>
#include <arpa/inet.h>
#include <unistd.h>
#include <grp.h>

/* libusb */
#include <usb.h>

#include "usb_helper.h"
#include "utils.h"
#include "socket_utils.h"

/* Must be identical to firmware */
#define VENDOR_ID   		0x16C0
#define PRODUCT_ID  		0x05DC
#define VENDOR_NAME 		"codedbearder.com"
#define PRODUCT_NAME		"desklight"

/* USB control messages */
#define USB_R	0	/* Red   */
#define USB_G	1	/* Green */
#define USB_B	2	/* Blue  */
#define USB_F   3	/* Fade  */

const int MAX_CLIENTS = 5;

void main_loop(int sockfd, usb_dev_handle* handle);

int main(void) {
	usb_dev_handle* handle = NULL;
	struct sockaddr_in server;
	int sockfd;

	/* Open USB device */
	if ((handle = usbOpenDevice(VENDOR_ID, VENDOR_NAME, PRODUCT_ID, PRODUCT_NAME)) == NULL) {
		perror("usbOpenDevice");
		exit(1);
	}

	if ((sockfd = socket(AF_INET, SOCK_STREAM, 0)) == -1) {
		perror("socket");
		exit(1);
	}

	memset(&server, 0, sizeof(server));
	server.sin_family = AF_INET;
	server.sin_addr.s_addr = htonl(INADDR_ANY);
	server.sin_port = htons(1234);

	if (bind(sockfd, (struct sockaddr*)&server, sizeof(server)) == -1) {
		perror("bind");
		exit(1);
	}

	if (listen(sockfd, 5) == -1) {
		perror("listen");
		exit(1);
	}

	main_loop(sockfd, handle);

	return 0;
}

void main_loop(int sockfd, usb_dev_handle* handle) {
	fd_set rfds;
	int highest_fd, retval, clients[MAX_CLIENTS];
	/* Initialize client array */
	for (int i = 0; i < MAX_CLIENTS; ++i) clients[i] = -1;

	for(;;) {
		highest_fd = populate_fd_set(&rfds, sockfd, clients);

		retval = wait_for_data(&rfds, highest_fd + 1);

		if (retval > 0)
			check_sockets(sockfd, &rfds, clients, handle);
	}
}
