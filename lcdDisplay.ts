const enum LCDWidgetCategoryOne {
    //% block="Slider(01)"
    Slider = 1,
    //% block="Bar(02)"
    Bar = 2,
    //% block="Compass(03)"
    Compass = 3,
    //% block="Gauge(04)"
    Gauge = 4,
    //% block="LineMeter(05)"
    LineMeter = 5,
}

const enum LCDWidgetCategoryTwo {
    //% block="Slider(01)"
    Slider = 1,
    //% block="Bar(02)"
    Bar = 2,
    //% block="Compass(03)"
    Compass = 3,
    //% block="Gauge(04)"
    Gauge = 4,
    //% block="LineMeter(05)"
    LineMeter = 5,
    //% block="Chart(06)"
    Chart = 6,
    //% block="Text(07)"
    Text = 7,
    //% block="Line(08)"
    Line = 8,
    //% block="Rectangle(09)"
    Rectangle = 9,
    //% block="Circle(10)"
    Circle = 10,
    //% block="Triangle(11)"
    Triangle = 11,
    //% block="Icon(12)"
    Icon = 12,
    //% block="Gif(13)"
    Gif = 13,
}

//% block="ColorScreen"
//% weight=100 color=#5b3fe8 icon="\uf022"
//% groups='["Basics", "Graph", "Widget"]'
namespace lcdDisplay {
    export enum FontSize {
        //% block="Large"
        Large = 1,
        //% block="Small"
        Small = 2,
    }

    export enum RectangleRound {
        //% block="RC"
        IsRound = 1,
        //% block="not RC"
        NoneRound = 2,
    }

    export enum ChartStyles {
        //% block="LineChart"
        LineChart = 3,
        //% block="BarChart"
        BarChart = 2,
        //% block="ShadingLineChart"
        ShadingLineChart = 1,
    }

    export enum DrawType {
        //% block="fill"
        Fill = 1,
        //% block="not fill"
        NotFill = 2,
    }

    export enum Protocol {
        IIC = 1,
        Serial = 2,
    }

    const IIC_MAX_TRANSFER_SIZE = 32
    const CMDLEN_OF_HEAD_LEN = 3
    const CMD_DELETE_OBJ_LEN = 0x06
    const CMD_SET_COMPASS_VALUE_LEN = 0x07
    const CMD_SET_LEN = 0x07
    const CMD_SET_GAUGE_VALUE_LEN = 0x07
    const CMD_SET_LINE_METER_VALUE_LEN = 0x07
    const CMD_SET_BAR_VALUE_LEN = 0x07
    const CMD_SET_SLIDER_VALUE_LEN = 0x07
    const CMD_SET_ANGLE_OBJ_LEN = 0x08
    const CMD_DRAW_COMPASS_LEN = 0x0B
    const CMD_DRAW_CHART_LEN = 0x09
    const CMD_DRAW_SERIE_LEN = 0x09
    const CMD_OF_DRAW_BAR_LEN = 0x10
    const CMD_OF_DRAW_SLIDER_LEN = 0x10
    const CMD_DRAW_LINE_LEN = 0x11
    const CMD_OF_DRAW_CIRCLE_LEN = 0x13
    const CMD_OF_DRAW_GAUGE_LEN = 0x15
    const CMD_OF_DRAW_LINE_METER_LEN = 0x15
    const CMD_OF_DRAW_RECT_LEN = 0x16
    const CMD_OF_DRAW_TRIANGLE_LEN = 0x19

    const CMD_SET_BACKGROUND_COLOR = 0x19
    const CMD_SET_BACKGROUND_IMG = 0x1A
    const CMD_OF_DRAW_LINE = 0x03
    const CMD_OF_DRAW_RECT = 0x04
    const CMD_OF_DRAW_CIRCLE = 0x06
    const CMD_OF_DRAW_TRIANGLE = 0x07
    const CMD_OF_DRAW_ICON_INTERNAL = 0x08
    const CMD_OF_DRAW_ICON_EXTERNAL = 0x09
    const CMD_OF_DRAW_BAR = 0x0A
    const CMD_OF_DRAW_BAR_VALUE = 0x0B
    const CMD_OF_DRAW_SLIDER = 0x0C
    const CMD_OF_DRAW_SLIDER_VALUE = 0x0D
    const CMD_OF_DRAW_COMPASS = 0x0E
    const CMD_OF_DRAW_COMPASS_VALUE = 0x0F
    const CMD_OF_DRAW_LINE_METER = 0x10
    const CMD_OF_DRAW_LINE_METER_VALUE = 0x11
    const CMD_OF_DRAW_GAUGE = 0x12
    const CMD_OF_DRAW_GAUGE_VALUE = 0x13
    const CMD_OF_DRAW_LINE_CHART = 0x14
    const CMD_OF_DRAW_LINE_CHART_TEXT = 0x15
    const CMD_OF_DRAW_SERIE = 0x16
    const CMD_OF_DRAW_SERIE_DATA = 0x17
    const CMD_OF_DRAW_TEXT = 0x18
    const CMD_DELETE_OBJ = 0x1B
    const CMD_SET_ANGLE_OBJ = 0x1E
    const CMD_OF_DRAW_GIF_INTERNAL = 0x1F
    const CMD_OF_DRAW_GIF_EXTERNAL = 0x20

    const CMD_HEADER_HIGH = 0x55
    const CMD_HEADER_LOW = 0xaa

    let address = 0x2c
    let protocol: Protocol = Protocol.IIC
    let chartID = 0
    let axisListX: string[] = []
    let axisListY: string[] = []
    let axisYData: number[] = []
    let seriesData: any = {}
    let dataFactor = 1

    /**
     * Initializes the display over I2C.
     */
    //% block="ColorScreen I2C initialization"
    //% weight=100
    //% group="Basics"
    export function lcdInitIIC() {
        protocol = Protocol.IIC
        basic.pause(1000)
    }

    /**
     * Initializes the display over UART/Serial at 9600 baud.
     * Use crossed wiring: display R to controller TX, and display T to controller RX.
     * @param tx controller TX pin connected to display R, eg: SerialPin.P1
     * @param rx controller RX pin connected to display T, eg: SerialPin.P0
     */
    //% block="ColorScreen UART initialization TX %tx RX %rx"
    //% tx.defl=SerialPin.P1
    //% rx.defl=SerialPin.P0
    //% weight=99
    //% group="Basics"
    export function lcdInitUART9600(tx: SerialPin, rx: SerialPin) {
        serial.redirect(tx, rx, BaudRate.BaudRate9600)
        protocol = Protocol.Serial
        basic.pause(1000)
    }

    /** Clear the screen. */
    //% block="clear the screen"
    //% weight=95
    //% group="Basics"
    export function lcdClearAll() {
        let cmd = creatCommand(0x1D, 0x04)
        writeCommand(cmd, 4)
        basic.pause(1500)
    }

    /**
     * Sets the background color.
     * @param color RGB color, eg: 0xFF0000
     */
    //% block="set the background color %color"
    //% color.shadow="colorNumberPicker"
    //% weight=90
    //% group="Basics"
    export function lcdSetBgcolor(color: number) {
        let cmd = creatCommand(CMD_SET_BACKGROUND_COLOR, CMD_SET_LEN)
        cmd = cmd.concat(data24Tobyte(colorToCustom(color)))
        writeCommand(cmd, CMD_SET_LEN)
        basic.pause(300)
    }

    /**
     * Converts red, green and blue channels into an RGB color.
     */
    //% block="red %red green %green blue %blue"
    //% red.min=0 red.max=255 red.defl=255
    //% green.min=0 green.max=255 green.defl=255
    //% blue.min=0 blue.max=255 blue.defl=255
    //% weight=85
    //% group="Basics"
    export function lcdGetRgbColor(red: number, green: number, blue: number): number {
        return (red << 16) + (green << 8) + blue
    }

    /** Sets the background picture. */
    //% block="set the background picture %picture"
    //% weight=80
    //% group="Basics"
    export function lcdSetBgIamge(picture: string) {
        let len = picture.length
        let cmd = creatCommand(CMD_SET_BACKGROUND_IMG, len + 5)
        cmd = cmd.concat([1])
        appendString(cmd, picture)
        writeCommand(cmd, len + 5)
    }

    /** Displays text. */
    //% block="display text %text number %num position x: %x y: %y size %size color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=75
    //% group="Basics"
    export function lcdDisplayText(text: string, num: number, x: number, y: number, size: FontSize, color: number) {
        let len = text.length > 242 ? 242 : text.length
        let cmd = creatCommand(CMD_OF_DRAW_TEXT, len + 13)
        cmd = cmd.concat([num, size]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        appendString(cmd, text.substr(0, len))
        writeCommand(cmd, len + 13)
    }

    /** Displays a time string. */
    //% block="display time number %num time %time position x: %x y: %y size %size color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=70
    //% group="Basics"
    //% deprecated=true
    export function lcdDisplayTime(num: number, time: string, x: number, y: number, size: FontSize, color: number) {
        lcdDisplayText(time, num, x, y, size, color)
    }

    /** Builds a time string. */
    //% block="hour %hour minutes %min second %sec"
    //% hour.min=0 hour.max=23 hour.defl=12
    //% min.min=0 min.max=59 min.defl=40
    //% sec.min=0 sec.max=59 sec.defl=30
    //% inlineInputMode=inline
    //% weight=68
    //% group="Basics"
    export function lcdGetTime(hour: number, min: number, sec: number): string {
        return `${hour < 10 ? "0" + hour : "" + hour}:${min < 10 ? "0" + min : "" + min}:${sec < 10 ? "0" + sec : "" + sec}`
    }

    /** Displays an image. */
    //% block="display image number %num name %name position x: %x y: %y size %size"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% size.min=0 size.max=512 size.defl=256
    //% inlineInputMode=inline
    //% weight=65
    //% group="Basics"
    export function lcdDisplayIamge(num: number, name: string, x: number, y: number, size: number) {
        let len = name.length
        let cmd = creatCommand(CMD_OF_DRAW_ICON_EXTERNAL, len + 11)
        cmd = cmd.concat([num]).concat(data16Tobyte(size)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        appendString(cmd, name)
        writeCommand(cmd, len + 11)
    }

    /** Rotates an image. */
    //% block="rotate image number %num angle %angle"
    //% num.min=1 num.max=255 num.defl=1
    //% angle.min=0 angle.max=360 angle.defl=180
    //% weight=60
    //% group="Basics"
    export function lcdRotateIamge(num: number, angle: number) {
        let cmd = creatCommand(CMD_SET_ANGLE_OBJ, CMD_SET_ANGLE_OBJ_LEN)
        cmd = cmd.concat([CMD_OF_DRAW_ICON_INTERNAL, num]).concat(data16Tobyte(angle * 10))
        writeCommand(cmd, CMD_SET_ANGLE_OBJ_LEN)
    }

    /** Displays a GIF. */
    //% block="display gif number %num name %name position x: %x y: %y size %size"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=120
    //% y.min=0 y.max=240 y.defl=120
    //% size.min=0 size.max=512 size.defl=256
    //% inlineInputMode=inline
    //% weight=58
    //% group="Basics"
    export function lcdDisplayGif(num: number, name: string, x: number, y: number, size: number) {
        let len = name.length
        let cmd = creatCommand(CMD_OF_DRAW_GIF_EXTERNAL, len + 11)
        cmd = cmd.concat([num]).concat(data16Tobyte(size)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        appendString(cmd, name)
        writeCommand(cmd, len + 11)
    }

    /** Draws a line. */
    //% block="draw line number %num start x1: %x1 y1: %y1 end x2: %x2 y2: %y2 width %width color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x1.min=0 x1.max=320 x1.defl=40
    //% y1.min=0 y1.max=240 y1.defl=120
    //% x2.min=0 x2.max=320 x2.defl=300
    //% y2.min=0 y2.max=240 y2.defl=120
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=55
    //% group="Graph"
    //% advanced=true
    export function lcdDrawLine(num: number, x1: number, y1: number, x2: number, y2: number, width: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE, CMD_DRAW_LINE_LEN)
        cmd = cmd.concat([num, width]).concat(data24Tobyte(color)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1)).concat(data16Tobyte(x2)).concat(data16Tobyte(y2))
        writeCommand(cmd, CMD_DRAW_LINE_LEN)
    }

    /** Draws a rectangle. */
    //% block="draw rectangle number %num start x: %x y: %y width %w height %h line width %width Border color %bocolor %fill color %fcolor %round"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=0
    //% y.min=0 y.max=240 y.defl=0
    //% w.min=0 w.max=320 w.defl=300
    //% h.min=0 h.max=240 h.defl=200
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=50
    //% group="Graph"
    //% advanced=true
    export function lcdDrawRectangle(num: number, x: number, y: number, w: number, h: number, width: number, bocolor: number, fill: DrawType, fcolor: number, round: RectangleRound) {
        let cmd = creatCommand(CMD_OF_DRAW_RECT, CMD_OF_DRAW_RECT_LEN)
        cmd = cmd.concat([num, width]).concat(data24Tobyte(bocolor)).concat([fill === DrawType.Fill ? 1 : 0]).concat(data24Tobyte(fcolor)).concat([round === RectangleRound.IsRound ? 1 : 0]).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h))
        writeCommand(cmd, CMD_OF_DRAW_RECT_LEN)
    }

    /** Draws a circle. */
    //% block="draw circle number %num center x: %x y: %y radius %r line width %width Border color %bocolor %fill color %fcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=160
    //% y.min=0 y.max=240 y.defl=120
    //% r.min=0 r.max=120 r.defl=120
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=45
    //% group="Graph"
    //% advanced=true
    export function lcdDrawCircle(num: number, x: number, y: number, r: number, width: number, bocolor: number, fill: DrawType, fcolor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_CIRCLE, CMD_OF_DRAW_CIRCLE_LEN)
        cmd = cmd.concat([num, width]).concat(data24Tobyte(bocolor)).concat([fill === DrawType.Fill ? 1 : 0]).concat(data24Tobyte(fcolor)).concat(data16Tobyte(r)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_OF_DRAW_CIRCLE_LEN)
    }

    /** Draws a triangle. */
    //% block="draw triangle number %num x1: %x1 y1: %y1 x2: %x2 y2: %y2 x3: %x3 y3: %y3 line width %width Border color %bocolor %fill color %fcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x1.min=0 x1.max=320 x1.defl=160
    //% y1.min=0 y1.max=240 y1.defl=0
    //% x2.min=0 x2.max=320 x2.defl=0
    //% y2.min=0 y2.max=240 y2.defl=240
    //% x3.min=0 x3.max=320 x3.defl=320
    //% y3.min=0 y3.max=240 y3.defl=240
    //% bocolor.shadow="colorNumberPicker"
    //% fcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=40
    //% group="Graph"
    //% advanced=true
    export function lcdDrawTriangle(num: number, x1: number, y1: number, x2: number, y2: number, x3: number, y3: number, width: number, bocolor: number, fill: DrawType, fcolor: number) {
        let cmd = creatCommand(CMD_OF_DRAW_TRIANGLE, CMD_OF_DRAW_TRIANGLE_LEN)
        cmd = cmd.concat([num, width]).concat(data24Tobyte(bocolor)).concat([fill === DrawType.Fill ? 1 : 0]).concat(data24Tobyte(fcolor)).concat(data16Tobyte(x1)).concat(data16Tobyte(y1)).concat(data16Tobyte(x2)).concat(data16Tobyte(y2)).concat(data16Tobyte(x3)).concat(data16Tobyte(y3))
        writeCommand(cmd, CMD_OF_DRAW_TRIANGLE_LEN)
    }

    /** Draws a slider widget. */
    //% block="draw slider number %num position x: %x y: %y width %w height %h color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=80
    //% y.min=0 y.max=240 y.defl=120
    //% w.min=0 w.max=320 w.defl=200
    //% h.min=0 h.max=240 h.defl=20
    //% color.shadow="colorNumberPicker"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    //% weight=35
    //% group="Widget"
    //% advanced=true
    export function lcdDrawSlider(num: number, x: number, y: number, w: number, h: number, color: number) {
        drawSizedWidget(CMD_OF_DRAW_SLIDER, CMD_OF_DRAW_SLIDER_LEN, num, x, y, w, h, color)
    }

    /** Draws a bar widget. */
    //% block="draw bar number %num position x: %x y: %y width %w height %h color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=80
    //% y.min=0 y.max=240 y.defl=120
    //% w.min=0 w.max=320 w.defl=200
    //% h.min=0 h.max=240 h.defl=20
    //% color.shadow="colorNumberPicker"
    //% expandableArgumentMode="toggle"
    //% inlineInputMode=inline
    //% weight=30
    //% group="Widget"
    //% advanced=true
    export function lcdDrawBar(num: number, x: number, y: number, w: number, h: number, color: number) {
        drawSizedWidget(CMD_OF_DRAW_BAR, CMD_OF_DRAW_BAR_LEN, num, x, y, w, h, color)
    }

    /** Draws a compass widget. */
    //% block="draw compass number %num position x: %x y: %y radius %r"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=50
    //% y.min=0 y.max=240 y.defl=0
    //% r.min=0 r.max=320 r.defl=240
    //% inlineInputMode=inline
    //% weight=25
    //% group="Widget"
    //% advanced=true
    export function lcdDrawCompass(num: number, x: number, y: number, r: number) {
        let cmd = creatCommand(CMD_OF_DRAW_COMPASS, CMD_DRAW_COMPASS_LEN)
        cmd = cmd.concat([num]).concat(data16Tobyte(r)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, CMD_DRAW_COMPASS_LEN)
    }

    /** Draws a gauge widget. */
    //% block="draw gauge number %num position x: %x y: %y radius %r start of scale %start End of scale %end Pointer color %color Dial color %dcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=50
    //% y.min=0 y.max=240 y.defl=0
    //% r.min=0 r.max=320 r.defl=240
    //% start.min=0 start.max=360 start.defl=0
    //% end.min=0 end.max=360 end.defl=360
    //% color.shadow="colorNumberPicker"
    //% dcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=20
    //% group="Widget"
    //% advanced=true
    export function lcdDrawGauge(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
        drawMeterWidget(CMD_OF_DRAW_GAUGE, CMD_OF_DRAW_GAUGE_LEN, num, x, y, r, start, end, color, dcolor)
    }

    /** Draws a line meter widget. */
    //% block="draw lineMeter number %num position x: %x y: %y radius %r start of scale %start End of scale %end Data color %color Dial color %dcolor"
    //% num.min=1 num.max=255 num.defl=1
    //% x.min=0 x.max=320 x.defl=0
    //% y.min=0 y.max=240 y.defl=0
    //% r.min=0 r.max=320 r.defl=240
    //% start.min=0 start.max=360 start.defl=0
    //% end.min=0 end.max=360 end.defl=100
    //% color.shadow="colorNumberPicker"
    //% dcolor.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=18
    //% group="Widget"
    //% advanced=true
    export function lcdDrawLineMeter(num: number, x: number, y: number, r: number, start: number, end: number, color: number, dcolor: number) {
        drawMeterWidget(CMD_OF_DRAW_LINE_METER, CMD_OF_DRAW_LINE_METER_LEN, num, x, y, r, start, end, color, dcolor)
    }

    /** Sets widget data. */
    //% block="set %type=LCDWidgetCategoryOne_conv widget number %num data %data"
    //% num.min=1 num.max=255 num.defl=1
    //% weight=17
    //% group="Widget"
    //% advanced=true
    export function lcdSetWidgetData(type: number, num: number, data: number) {
        switch (type) {
            case LCDWidgetCategoryOne.Slider:
                setWidgetValue(CMD_OF_DRAW_SLIDER_VALUE, CMD_SET_SLIDER_VALUE_LEN, num, data)
                break
            case LCDWidgetCategoryOne.Bar:
                setWidgetValue(CMD_OF_DRAW_BAR_VALUE, CMD_SET_BAR_VALUE_LEN, num, data)
                break
            case LCDWidgetCategoryOne.Compass:
                setWidgetValue(CMD_OF_DRAW_COMPASS_VALUE, CMD_SET_COMPASS_VALUE_LEN, num, (data / 360) * 3600)
                break
            case LCDWidgetCategoryOne.Gauge:
                setWidgetValue(CMD_OF_DRAW_GAUGE_VALUE, CMD_SET_GAUGE_VALUE_LEN, num, data)
                break
            case LCDWidgetCategoryOne.LineMeter:
                setWidgetValue(CMD_OF_DRAW_LINE_METER_VALUE, CMD_SET_LINE_METER_VALUE_LEN, num, data)
                break
        }
    }

    /** Draws a chart widget. */
    //% block="draw chart number %num X-axis %xaxis Y-axis %yaxis background color %color styles %styles"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% inlineInputMode=inline
    //% weight=16
    //% group="Widget"
    //% advanced=true
    export function lcdDrawChart(num: number, xaxis: string, yaxis: string, color: number, styles: ChartStyles) {
        chartID = num
        axisListX = xaxis.split(" ")
        axisListY = yaxis.split(" ")
        axisYData = []
        axisListX.forEach((value, index) => axisYData.push(0))
        dataFactor = Math.abs((parseInt(axisListY[0]) - parseInt(axisListY[axisListY.length - 1])) / 100)
        if (dataFactor == 0) dataFactor = 1
        updateChart(chartID, color, styles)
        basic.pause(100)
        setChartAxisTexts(chartID, 0, axisListX)
        basic.pause(100)
        setChartAxisTexts(chartID, 1, axisListY)
    }

    /** Adds a chart data series. */
    //% block="Set chart data number %num color %color"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% weight=14
    //% group="Widget"
    //% advanced=true
    export function lcdAddChartData(num: number, color: number) {
        seriesData[num] = axisYData
        updateChartSeries(chartID, num, color)
        addChartSeriesData(chartID, num, seriesData[num], axisListX.length)
    }

    /** Sets one chart point. */
    //% block="set chart data number %num X-axis %xaxis data %data"
    //% num.min=1 num.max=255 num.defl=1
    //% weight=12
    //% group="Widget"
    //% advanced=true
    export function lcdSetChartData(num: number, xaxis: string, data: number) {
        let index = axisListX.indexOf(xaxis)
        if (index !== -1) {
            let min = parseInt(axisListY[axisListY.length - 1])
            let max = parseInt(axisListY[0])
            if (data < min || data > max) return
            updateChartPoint(chartID, num, index, Math.round((data - min) / dataFactor))
        }
    }

    /** Updates a chart widget. */
    //% block="Update chart data number %num background color %color styles %styles"
    //% num.min=1 num.max=255 num.defl=1
    //% color.shadow="colorNumberPicker"
    //% weight=10
    //% group="Widget"
    //% advanced=true
    export function lcdUpdateChart(num: number, color: number, styles: ChartStyles) {
        updateChart(num, color, styles)
    }

    /** Deletes a widget. */
    //% block="delete %type=LCDWidgetCategoryTwo_conv number %num"
    //% num.min=1 num.max=255 num.defl=1
    //% weight=5
    //% group="Widget"
    //% advanced=true
    export function lcdDeleteWidget(type: number, num: number) {
        let cmd = creatCommand(CMD_DELETE_OBJ, CMD_DELETE_OBJ_LEN)
        cmd = cmd.concat([type, num])
        writeCommand(cmd, CMD_DELETE_OBJ_LEN)
    }

    /** Returns the corresponding LCDWidgetCategoryOne number. */
    //% blockId="LCDWidgetCategoryOne_conv" block="%item"
    //% weight=2 blockHidden=true
    export function getWidgetCategoryOne(item: LCDWidgetCategoryOne): number {
        return item as number
    }

    /** Returns the corresponding LCDWidgetCategoryTwo number. */
    //% blockId="LCDWidgetCategoryTwo_conv" block="%item"
    //% weight=1 blockHidden=true
    export function getLCDWidgetCategoryTwo(item: LCDWidgetCategoryTwo): number {
        return item as number
    }

    function drawSizedWidget(cmdId: number, cmdLen: number, id: number, x: number, y: number, w: number, h: number, color: number) {
        let cmd = creatCommand(cmdId, cmdLen)
        cmd = cmd.concat([id]).concat(data24Tobyte(color)).concat(data16Tobyte(x)).concat(data16Tobyte(y)).concat(data16Tobyte(w)).concat(data16Tobyte(h))
        writeCommand(cmd, cmdLen)
    }

    function drawMeterWidget(cmdId: number, cmdLen: number, id: number, x: number, y: number, size: number, start: number, end: number, pointerColor: number, bgColor: number) {
        let cmd = creatCommand(cmdId, cmdLen)
        cmd = cmd.concat([id]).concat(data16Tobyte(size)).concat(data16Tobyte(start)).concat(data16Tobyte(end)).concat(data24Tobyte(pointerColor)).concat(data24Tobyte(bgColor)).concat(data16Tobyte(x)).concat(data16Tobyte(y))
        writeCommand(cmd, cmdLen)
    }

    function setWidgetValue(cmdId: number, cmdLen: number, id: number, value: number) {
        let cmd = creatCommand(cmdId, cmdLen)
        cmd = cmd.concat([id]).concat(data16Tobyte(value))
        writeCommand(cmd, cmdLen)
    }

    function updateChart(id: number, bgColor: number, type: number) {
        let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART, CMD_DRAW_CHART_LEN)
        cmd = cmd.concat([id, type]).concat(data24Tobyte(bgColor))
        writeCommand(cmd, CMD_DRAW_CHART_LEN)
    }

    function updateChartSeries(chartId: number, seriesId: number, color: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE, CMD_DRAW_SERIE_LEN)
        cmd = cmd.concat([seriesId, chartId]).concat(data24Tobyte(color))
        writeCommand(cmd, CMD_DRAW_SERIE_LEN)
    }

    function setChartAxisTexts(chartId: number, axis: number, text: string[]) {
        let len = text.length - 1
        text.forEach((value, index) => len = len + value.length)
        let cmd = creatCommand(CMD_OF_DRAW_LINE_CHART_TEXT, len + 6)
        cmd = cmd.concat([chartId, axis])
        for (let i = 0; i < text.length; i++) {
            appendString(cmd, text[i])
            if (i != text.length - 1) cmd.push(0x0A)
        }
        writeCommand(cmd, len + 6)
    }

    function updateChartPoint(chartId: number, seriesId: number, pointNum: number, value: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, 10)
        cmd = cmd.concat([chartId, seriesId, 1, pointNum]).concat(data16Tobyte(value))
        writeCommand(cmd, 10)
    }

    function addChartSeriesData(chartId: number, seriesId: number, point: number[], len: number) {
        let cmd = creatCommand(CMD_OF_DRAW_SERIE_DATA, len * 2 + 8)
        cmd = cmd.concat([chartId, seriesId, 0, 0])
        point.forEach((value, index) => cmd = cmd.concat(data16Tobyte(value)))
        writeCommand(cmd, len * 2 + 8)
    }

    function data16Tobyte(data: number): number[] {
        return [(data >> 8) & 0xFF, data & 0xFF]
    }

    function data24Tobyte(data: number): number[] {
        return [(data >> 16) & 0xFF, (data >> 8) & 0xFF, data & 0xFF]
    }

    function colorToCustom(color: number): number {
        switch (color) {
            case 0x999999:
                return 0x696969
            case 0x7f00ff:
                return 0x800080
            default:
                return color
        }
    }

    function creatCommand(cmd: number, len: number): number[] {
        return [CMD_HEADER_HIGH, CMD_HEADER_LOW, len - CMDLEN_OF_HEAD_LEN, cmd]
    }

    function appendString(cmd: number[], value: string) {
        value.split("").forEach((char, index) => cmd.push(char.charCodeAt(0)))
    }

    function writeCommand(data: number[], len: number) {
        if (protocol == Protocol.IIC) {
            let remain = len
            let i = 0
            while (remain > 0) {
                let currentTransferSize = remain > IIC_MAX_TRANSFER_SIZE ? IIC_MAX_TRANSFER_SIZE : remain
                pins.i2cWriteBuffer(address, pins.createBufferFromArray(data.slice(i * IIC_MAX_TRANSFER_SIZE, i * IIC_MAX_TRANSFER_SIZE + currentTransferSize)), remain > IIC_MAX_TRANSFER_SIZE)
                remain = remain - currentTransferSize
                i = i + 1
            }
        } else {
            serial.writeBuffer(pins.createBufferFromArray(data.slice(0, len)))
        }
    }
}
