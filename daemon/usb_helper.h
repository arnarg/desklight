/*
* usbhelper.h
*
* Created 6 Apr 2014 by J. Palermo
* (C) Copyright 2014 J. Palermo, GNU GPLv3
*
* Based on code from the following project:
*
* Project: AVR ATtiny USB Tutorial at http://codeandlife.com/
* Author: Joonas Pihlajamaa, joonas.pihlajamaa@iki.fi
* Based on V-USB example code by Christian Starkjohann
* Copyright: (C) 2012 by Joonas Pihlajamaa
* License: GNU GPL v3 (see License.txt)
*/
#ifndef USB_HELPER_H
#define USB_HELPER_H
#include <usb.h>
/* Used to get descriptor strings for device identification */
int usbGetDescriptorString(usb_dev_handle *dev, int index, int langid,
                                  char *buf, int buflen);

/******************************************************************************/
usb_dev_handle * usbOpenDevice(int vendor, char *vendorName,
                                      int product, char *productName);
#endif
