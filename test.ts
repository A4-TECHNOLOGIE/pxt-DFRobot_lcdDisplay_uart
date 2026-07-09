// Basic compile test for the LCD Display UART fork.

// Original I2C mode remains available.
lcdDisplay.lcdInitIIC()
lcdDisplay.lcdClearAll()
lcdDisplay.lcdSetBgcolor(0x000000)

// UART mode added by the A4 fork.
lcdDisplay.lcdInitUART9600(SerialPin.P1, SerialPin.P0)
lcdDisplay.lcdClearAll()
lcdDisplay.lcdSetBgcolor(0x7f00ff)
lcdDisplay.lcdDisplayText("AI Vision", 1, 10, 10, lcdDisplay.FontSize.Small, 0xffffff)
lcdDisplay.lcdDrawRectangle(1, 0, 0, 120, 60, 2, 0xffffff, lcdDisplay.DrawType.NotFill, 0x000000, lcdDisplay.RectangleRound.NoneRound)
