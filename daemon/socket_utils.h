#ifndef SOCKET_UTILS_H
#define SOCKET_UTILS_H
#include <stdio.h>
#include <sys/socket.h>
#include <sys/types.h>
#include <arpa/inet.h>
#include <usb.h>
#include "usb_helper.h"
#include "utils.h"

int populate_fd_set(fd_set* fdset, int initial_fd, int* arr);
int wait_for_data(fd_set* fdset, int highest);
void check_sockets(int master_fd, fd_set* fdset, int* clients, usb_dev_handle* usb_handle);
void handle_master_socket(int master_fd, int* clients);
int add_to_store(int connfd, int* arr);
void disconnect_client(int* clients, int i);
void handle_client_sockets(fd_set* fdset, int* clients, usb_dev_handle* usb_handle);
void check_client(int i, int* clients, usb_dev_handle* usb_handle);
void handle_data(char* data, int length, usb_dev_handle* usb_handle);

#endif
