// Compile-only checks. These functions are intentionally not called so the
// simulator does not attempt to communicate with physical display hardware.

function testBasicDisplayApi() {
    lcdDisplay.lcdInitIIC()
    lcdDisplay.lcdInitUART9600(SerialPin.P1, SerialPin.P0)
    lcdDisplay.lcdClearAll()
    lcdDisplay.lcdSetBgcolor(0x000000)
    const color = lcdDisplay.lcdGetRgbColor(255, 0, 127)
    const time = lcdDisplay.lcdGetTime(12, 30, 0)

    lcdDisplay.lcdSetBgIamge("/background.png")
    lcdDisplay.lcdDisplayText("AI Vision", 1, 10, 10, lcdDisplay.FontSize.Small, 0xffffff)
    lcdDisplay.lcdDisplayTime(2, time, 10, 40, lcdDisplay.FontSize.Large, color)
    lcdDisplay.lcdDisplayIamge(3, "/icon.png", 10, 70, 64)
    lcdDisplay.lcdRotateIamge(3, 90)
    lcdDisplay.lcdDisplayGif(4, "/animation.gif", 100, 70, 64)
}

function testGraphApi() {
    lcdDisplay.lcdDrawLine(1, 0, 0, 100, 100, 2, 0xffffff)
    lcdDisplay.lcdDrawRectangle(1, 0, 0, 120, 60, 2, 0xffffff, lcdDisplay.DrawType.NotFill, 0x000000, lcdDisplay.RectangleRound.NoneRound)
    lcdDisplay.lcdDrawCircle(1, 80, 80, 40, 2, 0xffffff, lcdDisplay.DrawType.Fill, 0x000000)
    lcdDisplay.lcdDrawTriangle(1, 80, 0, 0, 100, 160, 100, 2, 0xffffff, lcdDisplay.DrawType.NotFill, 0x000000)
}

function testWidgetApi() {
    lcdDisplay.lcdDrawSlider(1, 20, 20, 200, 20, 0x00ff00)
    lcdDisplay.lcdDrawBar(2, 20, 50, 200, 20, 0x00ffff)
    lcdDisplay.lcdDrawCompass(3, 20, 80, 100)
    lcdDisplay.lcdDrawGauge(4, 20, 80, 100, 0, 100, 0xff0000, 0xffffff)
    lcdDisplay.lcdDrawLineMeter(5, 20, 80, 100, 0, 100, 0x00ff00, 0xffffff)

    lcdDisplay.lcdSetWidgetData(lcdDisplay.getWidgetCategoryOne(LCDWidgetCategoryOne.Slider), 1, 50)
    lcdDisplay.lcdSetWidgetData(lcdDisplay.getWidgetCategoryOne(LCDWidgetCategoryOne.Bar), 2, 50)
    lcdDisplay.lcdSetWidgetData(lcdDisplay.getWidgetCategoryOne(LCDWidgetCategoryOne.Compass), 3, 180)
    lcdDisplay.lcdSetWidgetData(lcdDisplay.getWidgetCategoryOne(LCDWidgetCategoryOne.Gauge), 4, 50)
    lcdDisplay.lcdSetWidgetData(lcdDisplay.getWidgetCategoryOne(LCDWidgetCategoryOne.LineMeter), 5, 50)

    lcdDisplay.lcdDrawChart(6, "0 1 2", "100 50 0", 0xffffff, lcdDisplay.ChartStyles.LineChart)
    lcdDisplay.lcdAddChartData(1, 0xff0000)
    lcdDisplay.lcdSetChartData(1, "1", 50)
    lcdDisplay.lcdUpdateChart(6, 0xffffff, lcdDisplay.ChartStyles.BarChart)
}

function testDeleteWidgetApi() {
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Slider), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Bar), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Compass), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Gauge), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.LineMeter), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Chart), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Text), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Line), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Rectangle), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Circle), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Triangle), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Icon), 1)
    lcdDisplay.lcdDeleteWidget(lcdDisplay.getLCDWidgetCategoryTwo(LCDWidgetCategoryTwo.Gif), 1)
}
