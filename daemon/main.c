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
	unsigned char value;
} packet;

int main(void) {
	usb_dev_handle* handle = NULL;
	struct sockaddr_in server, client;
	int sockfd, connfd, i, max_fd, retval, len, clients[MAX_CLIENTS];
	fd_set rfds;
	char buf[8];

	/* Open USB device */
	if ((handle = usbOpenDevice(VENDOR_ID, VENDOR_NAME, PRODUCT_ID, PRODUCT_NAME)) == NULL) {
		perror("usbOpenDevice");
		exit(1);
	}

	/* Initialize client array */
	for (i = 0; i < MAX_CLIENTS; ++i) clients[i] = -1;

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

	for(;;) {
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
			perror("select");
		}

		if (retval > 0) {
			if (FD_ISSET(sockfd, &rfds)) {
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
					if((retval = read(clients[i], buf, sizeof(buf))) == 0) {
						printf("Closing connection.\n");
						close(clients[i]);
						clients[i] = -1;
					} else {
						len = retval;
						for (i = 0; i < len; i += sizeof(packet)) {
							p = (packet*)(buf+i);

							/* Send to usb */
							retval = usb_control_msg(handle,
								USB_TYPE_VENDOR | USB_RECIP_DEVICE | USB_ENDPOINT_IN,
								p->opcode, p->value, 0, buf, sizeof(buf), 5000);
							if (retval < 0) {
								perror("usb_control_msg");
							}
						}
					}
				}
			}
		}
	}

	return 0;
}
