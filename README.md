# pxt-DFRobot_lcdDisplay_uart

MakeCode extension for the DFRobot LCD display, with UART/Serial support added for A4 microSySTEM projects.

This repository is based on the DFRobot LCD Display MakeCode extension and keeps the same package name and namespace:

- package name: `lcdDisplay`
- namespace: `lcdDisplay`

Keeping the same namespace allows existing blocks such as `lcdDisplay.lcdClearAll()` and `lcdDisplay.lcdSetBgcolor(...)` to work when this fork is used as the dependency.

## Main addition

This fork adds UART initialization at 9600 baud:

```typescript
lcdDisplay.lcdInitUART9600(SerialPin.P1, SerialPin.P0)
```

UART wiring must be crossed:

- display **R** to controller **TX**
- display **T** to controller **RX**

For the A4 microSySTEM AI Vision mock-up, the default wiring is:

- controller **TX P1** to display **R**
- controller **RX P0** to display **T**

Set the display DIP switch to **UART / Serial** mode before using UART.

## Basic usage

```typescript
lcdDisplay.lcdInitUART9600(SerialPin.P1, SerialPin.P0)
lcdDisplay.lcdClearAll()
lcdDisplay.lcdSetBgcolor(0x7f00ff)
lcdDisplay.lcdDisplayText("AI Vision", 1, 10, 10, lcdDisplay.FontSize.Small, 0xffffff)
```

## I2C usage

The original I2C initialization block is still available:

```typescript
lcdDisplay.lcdInitIIC()
```

## License

MIT

Original work Copyright (c) 2021 TgJe  
UART support and A4 adaptations Copyright (c) 2026 A4 Technologie

```package
lcdDisplay=github:A4-TECHNOLOGIE/pxt-DFRobot_lcdDisplay_uart
```
