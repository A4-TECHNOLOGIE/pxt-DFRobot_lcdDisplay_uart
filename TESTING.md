# Testing and validation

This document defines the compilation and hardware acceptance tests for the A4 UART-compatible fork of the DFRobot color LCD MakeCode extension.

## Automated compilation test

The root `test.ts` file references every public API in compile-only functions. These functions are intentionally not called, so the MakeCode simulator does not attempt to communicate with a physical display.

The automated test passes when the package and all public functions compile without errors and the simulator starts without a hardware-related exception.

## Required hardware

- one BBC micro:bit;
- one compatible DFRobot 2.8-inch color LCD;
- a suitable power source and connecting leads.

## Test 1 - I2C compatibility

1. Set the display to I2C mode and connect it as specified by DFRobot.
2. Initialize I2C, clear the screen, set a background color and display text.

**Pass:** the original I2C functions behave as before the UART fork.

**Fail:** the screen does not update or the displayed content is corrupted.

## Test 2 - UART communication

1. Set the display to UART/Serial mode.
2. Connect controller TX to display R and controller RX to display T.
3. Initialize UART at 9600 baud, clear the screen and display text and a rectangle.

**Pass:** all requested objects are displayed correctly and repeated updates remain stable.

**Fail:** no object appears, bytes are corrupted, or communication stops after an update.

## Test 3 - deletion command regression

1. Display text objects 3 and 4 and a rectangle object 5.
2. Delete text objects 3 and 4 with `lcdDeleteWidget`.
3. Do not clear or repaint the screen.

**Pass:** text objects 3 and 4 disappear and rectangle 5 remains visible.

**Fail:** the texts remain visible, the rectangle is deleted, or the whole screen changes.

Repeat the test with each category in the deletion dropdown: slider, bar, compass, gauge, line meter, chart, text, line, rectangle, circle, triangle, icon and GIF.

## Release acceptance record

Record the hardware configuration and result before creating a public release.

| Test | Result | Notes |
|---|---|---|
| I2C compatibility | Not run | Requires a physical LCD |
| UART communication | Not run | Requires a physical LCD |
| Widget deletion | Not run | Requires a physical LCD |
