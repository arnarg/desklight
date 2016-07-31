PROG = desklight

CC = gcc
STRIP = strip
CFLAGS = -Wall -O2

OBJS = main.o

all: $(PROG)

$(PROG): $(OBJS)
	$(CC) -o $(PROG) $(OBJS)
	$(STRIP) $(PROG)

clean:
	rm -rf *.o $(PROG)
