#include <avr/io.h>
#include <avr/wdt.h>
#include <avr/interrupt.h>
#include <util/delay.h>

#include "usbdrv.h"

/* For hadUsbReset() */
#define abs(x) ((x) > 0 ? (x) : (-x))

/* Pin macros */
#define R_PIN	PB0
#define G_PIN	PB1
#define B_PIN	PB4

/* PWM macros */
#define R_PWM	OCR0A
#define G_PWM	OCR0B
#define B_PWM	OCR1B

/* USB control messages */
#define USB_R	0
#define USB_G	1
#define USB_B	2
#define USB_F   3

typedef struct {
	uchar curr;
	uchar dest;
} led;

/* usbFunctionSetup needs to access, needs to be global */
led red = {255, 0};
led green = {255, 0};
led blue = {255, 0};

int fade = 0;
int delay_counter = 0;

void pwm_setup(void);
void fade_step(led* intensity);
USB_PUBLIC uchar usbFunctionSetup(uchar data[8]);
void hadUsbReset(void);

int main(void) {
	/* Set led pins as output */
	DDRB = (1 << R_PIN) | (1 << G_PIN) | (1 << B_PIN);

	/* Enable watchdog timer */
	wdt_enable(WDTO_1S);

	/* PWM initialization */
	pwm_setup();
	R_PWM = 255;
	G_PWM = 255;
	B_PWM = 255;

	/* USB initialization */
	usbInit();

	/* enforce re-enumeration */
	usbDeviceDisconnect();
	/* wait 500 ms */
	for(uchar i = 0; i<250; i++) {
		wdt_reset();
		_delay_ms(2);
	}
	usbDeviceConnect();

	/* Enable interrupts after re-enumeration */
	sei();

	while(1) {
		_delay_ms(2);
		/* Keep watchdog timer happy */
		wdt_reset();
		/* Poll USB */
		usbPoll();
		/* Fade leds */
		fade_step(&red);
		R_PWM = red.curr;
		fade_step(&green);
		G_PWM = green.curr;
		fade_step(&blue);
		B_PWM = blue.curr;
	}
}

void pwm_setup(void) {
	/* Fast PWM (inverted) for PB0 (Red) and PB1 (Green) */
	TCCR0A = (3 << COM0A0) | (3 << COM0B0) | (3 << WGM00);
	/* No prescaling */
	TCCR0B = (1 << CS00);

	/* PWM (inverted) for PB4 (Blue) */
	OCR1C = 255;
	GTCCR = (3 << COM1B0) | (1 << PWM1B);
	TCCR1 = (1 << COM1A0);
	/* No prescaling */
	TCCR1 |= (1 << CS10);
}

void fade_step(led* intensity) {
	/* Slower fade for fade mode */
	if (fade && (delay_counter = (delay_counter + 1) % 50)) return;

	if (intensity->curr != intensity->dest) {
		if (intensity->curr < intensity->dest) intensity->curr++;
		else                                   intensity->curr--;
	} else if (fade) {
		if (intensity->dest == 0)        intensity->dest = 255;
		else if (intensity->dest == 255) intensity->dest = 0;
	}
}


USB_PUBLIC uchar usbFunctionSetup(uchar data[8]) {
	/* Cast received data to correct type */
	usbRequest_t* rq = (void*)data;

	switch(rq->bRequest) {
		case USB_R:
			red.dest = 255 - rq->wValue.bytes[0];
			break;
		case USB_G:
			green.dest = 255 - rq->wValue.bytes[0];
			break;
		case USB_B:
			blue.dest = 255 - rq->wValue.bytes[0];
			break;
		case USB_F:
			if (!fade) {
				blue.dest = 0;
				blue.curr = 128;
				red.dest = 255;
				red.curr = 0;
				green.dest = 0;
				green.curr = 255;
				fade = 1;
			} else {
				fade = 0;
			}
			break;
	}

	return 0;
}

/* Called by V-USB after device reset */
void hadUsbReset() {
	int frameLength, targetLength = (unsigned)(1499 * (double)F_CPU / 10.5e6 + 0.5);
	int bestDeviation = 9999;
	/* bestCal = 0 to suppress warning */
	uchar trialCal, bestCal = 0, step, region;

	// do a binary search in regions 0-127 and 128-255 to get optimum OSCCAL
	for(region = 0; region <= 1; region++) {
		frameLength = 0;
		trialCal = (region == 0) ? 0 : 128;

		for(step = 64; step > 0; step >>= 1) {
			if(frameLength < targetLength) // true for initial iteration
				trialCal += step; // frequency too low
			else
				trialCal -= step; // frequency too high

			OSCCAL = trialCal;
			frameLength = usbMeasureFrameLength();

			if(abs(frameLength-targetLength) < bestDeviation) {
				bestCal = trialCal; // new optimum found
				bestDeviation = abs(frameLength -targetLength);
			}
		}
	}

	OSCCAL = bestCal;
}
