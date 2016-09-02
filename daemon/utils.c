#include "utils.h"

int socket_has_data(int fd, fd_set* fdset) {
	return fd > STDERR_FILENO && FD_ISSET(fd, fdset);
}
