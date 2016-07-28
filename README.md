Desklight
=========

I made this USB controller for an RGB led strip I have mounted under my desk, instead of using a (lame) IR controller that comes with many RGB led strips.

With it I wrote a daemon that you can communicate with through unix daemon socket and actually controls the USB controller.

This project uses [V-USB](https://www.obdev.at/products/vusb/index.html) (a software-only implementation of a low-speed USB device for Atmel’s AVR microcontrollers).

Firmware
--------
This project uses Atmel's attiny85 as the microcontroller.

There is a Makefile in the firmware directory that can write the correct fuses and flash the chip.

```bash
make fuse # Only needs to be run one time on each chip
make flash
```

If you're using another ISP programmer than usbtiny you need to change the ISP variable in the Makefile to your programmer as is expected by avrdude.

###Schematic coming soon

Daemon
------
The daemon opens up the usb connection and acts as a unix domain socket server which other programs can connect to to control the controller. The socket is located at `/tmp/desklightd.sock`.

It expects the group `desklight` to exist and every user in that group can connect to the socket.

```bash
groupadd desklight
usermod -aG desklight $USER
```

There is a Makefile and the default task produces a binary called desklightd.

```bash
make
./desklightd
```

There is also a systemd service file that can be used to run the program as a daemon.

This program depends on libusb.
