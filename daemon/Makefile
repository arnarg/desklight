PROG = desklightd

CC = gcc
STRIP = strip
CFLAGS = -Wall -O2
LIBS = -lusb

OBJS = main.o usb_helper.o utils.o socket_utils.c

all: $(PROG)

$(PROG): $(OBJS)
	$(CC) -o $(PROG) $(OBJS) $(LIBS)
	$(STRIP) $(PROG)

clean:
	rm -rf *.o $(PROG)
