#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <string.h>
#include <sys/socket.h>
#include <sys/un.h>

#define SOCK_PATH	"/tmp/desklightd.sock"

/* USB control messages */
#define RED			0
#define GREEN		1
#define BLUE		2
#define FADE		3

typedef struct {
	char opcode;
	unsigned char value;
} packet;

void print_usage(char* program);
int send_packet(int sockfd, packet p);

int main(int argc, char* argv[]) {
	int arg;
	int r_val = -1, g_val = -1, b_val = -1, f_val = 0;
	int was_set = 0;
	int sockfd, len;
	struct sockaddr_un remote;
	packet p;

	/* Parse args */
	while ((arg = getopt(argc, argv, "r:g:b:f")) != -1) {
		switch(arg) {
			case 'r':
				was_set = 1;
				r_val = atoi(optarg);
				if (r_val > 255){
					r_val = 255;
				}
				break;
			case 'g':
				was_set = 1;
				g_val = atoi(optarg);
				if (g_val > 255){
					g_val = 255;
				}
				break;
			case 'b':
				was_set = 1;
				b_val = atoi(optarg);
				if (b_val > 255){
					b_val = 255;
				}
				break;
			case 'f':
				was_set = 1;
				f_val = 1;
				break;
		}
	}

	/* If no parameter was set */
	if (!was_set) {
		print_usage(argv[0]);
		return 1;
	}

	if ((sockfd = socket(AF_UNIX, SOCK_STREAM, 0)) == -1) {
		perror("Could not create socket.\n");
		exit(1);
	}

	remote.sun_family = AF_UNIX;
	strcpy(remote.sun_path, SOCK_PATH);
	len = strlen(remote.sun_path) + sizeof(remote.sun_family);
	if (connect(sockfd, (struct sockaddr*)&remote, len) == -1) {
		perror("Could not connect to socket.\n");
		exit(1);
	}

	if (r_val >= 0) {
		p.opcode = RED;
		p.value = r_val;
		send_packet(sockfd, p);
	}
	if (g_val >= 0) {
		p.opcode = GREEN;
		p.value = g_val;
		send_packet(sockfd, p);
	}
	if (b_val >= 0) {
		p.opcode = BLUE;
		p.value = b_val;
		send_packet(sockfd, p);
	}
	if (f_val) {
		p.opcode = FADE;
		p.value = 0;
		send_packet(sockfd, p);
	}

	close(sockfd);

	return 0;
}

void print_usage(char* program) {
	printf("\n");
	printf("Usage:\n");
	printf("%s -r [0:255] -g [0:255] -b [0:255] -f", program);
	printf("\n");
}

int send_packet(int sockfd, packet p) {
	int ret;

	if ((ret = send(sockfd, (void*)&p, sizeof(p), 0)) == -1) {
		perror("Could not send packet.\n");
	}

	return ret;
}
