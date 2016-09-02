#ifndef UTILS_H
#define UTILS_H
#include <sys/types.h>
#include <unistd.h>

typedef struct {
	char opcode;
	unsigned char value;
} packet;

int socket_has_data(int fd, fd_set* fdset);

#endif
