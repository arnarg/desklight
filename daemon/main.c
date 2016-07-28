#include <stdio.h>
#include <stdlib.h>
#include <errno.h>
#include <string.h>
#include <sys/types.h>
#include <sys/socket.h>
#include <sys/un.h>
#include <sys/stat.h>
#include <unistd.h>
#include <grp.h>

/* libusb */
#include <usb.h>
#include "usb_helper.h"

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

#define SOCK_PATH "/tmp/desklightd.sock"
#define MAX_CLIENTS 5

typedef struct {
	char opcode;
	char value;
} packet;

void permission(void);

int main(void) {
	usb_dev_handle* handle = NULL;
	struct sockaddr_un server, client;
	int sockfd, connfd, i, max_fd, retval, len, clients[MAX_CLIENTS];
	fd_set rfds;
	char buf[5];

	/* Open USB device */
	if ((handle = usbOpenDevice(VENDOR_ID, VENDOR_NAME, PRODUCT_ID, PRODUCT_NAME)) == NULL) {
		perror("Could not open USB device.\n");
		exit(1);
	}

	/* Initialize client array */
	for (i = 0; i < MAX_CLIENTS; ++i) clients[i] = -1;

	if ((sockfd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
		perror("Could not create socket.\n");
		exit(1);
	}

	server.sun_family = AF_UNIX;
	strcpy(server.sun_path, SOCK_PATH);
	unlink(server.sun_path);
	len = strlen(server.sun_path) + sizeof(server.sun_family);

	if (bind(sockfd, (struct sockaddr*)&server, len) == -1) {
		perror("Could not bind socket.\n");
		exit(1);
	}

	/* Setting permissions for socket */
	permission();

	if (listen(sockfd, 5) == -1) {
		perror("Could not listen.\n");
		exit(1);
	}

	for(;;) {
		printf("Waiting for connections.\n");
		/* Empty the fd set */
		FD_ZERO(&rfds);
		/* Add the master socket to the set */
		FD_SET(sockfd, &rfds);

		/* Initialize max fd as sockfd */
		max_fd = sockfd;

		/* Add all active connections to the fd set */
		for (i = 0; i < MAX_CLIENTS; ++i) {
			if (clients[i] != -1) {
				FD_SET(clients[i], &rfds);
				if (clients[i] > max_fd) max_fd = clients[i];
			}
		}

		if ((retval = select(max_fd + 1, &rfds, NULL, NULL, NULL)) == -1) {
			perror("Select failed.\n");
		}

		if (retval > 0) {
			if (FD_ISSET(sockfd, &rfds)) {
				printf("Incoming connection.\n");
				int set = 0;
				len = sizeof(client);

				connfd = accept(sockfd, (struct sockaddr*)&client, (socklen_t*)&len);

				/* Add connection to array */
				for (i = 0; i < MAX_CLIENTS; ++i) {
					if (clients[i] == -1) {
						clients[i] = connfd;
						set = 1;
						printf("Accepted connection.\n");
						break;
					}
				}

				/* No space for it */
				if (!set) {
					printf("Too many connections, rejecting.\n");
					close(connfd);
				}
			}

			/* Check all open connections */
			for (i = 0; i < MAX_CLIENTS; ++i) {
				if (clients[i] != -1 && FD_ISSET(clients[i], &rfds)) {
					packet* p;
					printf("Message from client.\n");
					if((retval = read(clients[i], buf, sizeof(buf))) == 0) {
						printf("Closing connection.\n");
						close(clients[i]);
						clients[i] = -1;
					} else {
						p = (packet*)buf;
						printf("%d %d\n", p->opcode, p->value);
						/* Send to usb */
						retval = usb_control_msg(handle,
						                USB_TYPE_VENDOR | USB_RECIP_DEVICE | USB_ENDPOINT_IN,
						                p->opcode, p->value, 0, buf, sizeof(buf), 5000);
						if (retval < 0) {
							perror("usb_control_msg error.\n");
						}
					}
				}
			}
		}
	}

	return 0;
}

void permission(void) {
	int gid, uid = getuid();
	struct group* grp;

	/* Get gid of desklight group */
	if ((grp = getgrnam("desklight")) == NULL) {
		perror("Group desklight does not exist.\n");
		exit(1);
	}

	gid = grp->gr_gid;

	/* Change group ownership */
	if (chown(SOCK_PATH, uid, gid) == -1) {
		perror("Could not change group ownership of socket.\n");
		exit(1);
	}

	/* Give group permissions */
	if (chmod(SOCK_PATH, 0774) == -1) {
		perror("Could not change file permissions of socket.\n");
		exit(1);
	}
}
