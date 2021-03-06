Desklight
=========

I made this USB controller for an RGB led strip I have mounted under my desk, instead of using a (lame) IR controller that comes with many RGB led strips.

With it I wrote a daemon (not really a daemon, but I'm running it with systemd) that you can communicate with through TCP socket and actually controls the USB controller.

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

![Attiny85 pinout](https://yetanotherhackersblog.files.wordpress.com/2011/04/attiny85.png)
```
PB3: USB D-
PB2: USB D+
PB0: Red led
PB1: Green led
PB4: Blue led
```

There are good instructions on connecting usb to the V-USB powered microcontroller [here.](http://vusb.wikidot.com/hardware)

Daemon
------
The daemon opens up the usb connection and acts as a TCP socket server which other programs can connect to to control the controller.

There is a Makefile and the default task produces a binary called desklightd.

```bash
make
./desklightd
```

There is also a systemd service file that can be used to run the program as a daemon.

This program depends on libusb.

### Protocol
Each message is 2 bytes. First byte is an opcode and the second is a value.

#### Opcodes
```
#define RED			0
#define GREEN		1
#define BLUE		2
#define FADE		3
```

#### Examples
To change the red color:
```
-------------
| 0 | 0:255 |
-------------
```

Multiple messages can be combined into one packet:
```
-------------------------
| 0 | 0:255 | 2 | 0:255 |
-------------------------
```

Client
------
The client is a simple cli tool that talks to the daemon.

```
Usage:
desklight -r [0:255] -g [0:255] -b [0:255] -f
```

App
---
The app is written in React Native. As I don't own an iPhone or any Apple product, currently it only works on Android, but pull requests are welcome if you manage to get it working for iOS.

![Android screenshot](https://raw.githubusercontent.com/arnarg/desklight/master/images/android01.png)
