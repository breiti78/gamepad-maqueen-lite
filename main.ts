function FollowLine () {
    if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 0 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 255)
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 0 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 0)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 255)
        if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 0)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 255)
        }
    } else if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 1) {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        }
        if (maqueen.readPatrol(maqueen.Patrol.PatrolLeft) == 1 && maqueen.readPatrol(maqueen.Patrol.PatrolRight) == 0) {
            maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        } else {
            maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        }
    }
}
function recieveString (receievedString: string) {
    serial.writeLine(receievedString)
    if (receievedString == "A") {
        if (receievedString != lastButton) {
            _36GradLinks()
        }
    } else if (receievedString == "B") {
    	
    } else if (receievedString == "P16") {
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
    } else if (receievedString == "P14") {
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
    } else if (receievedString == "P15") {
        if (receievedString != lastButton) {
            LEDFarbeÄndern()
        }
    } else {
        Motor_Stop()
    }
    lastButton = receievedString
}
function fahrerückwärts () {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, x - y)
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CCW, x + y)
}
function measureBattery () {
    V_Bat = pins.analogReadPin(AnalogReadWritePin.P0) * 1000 / 340
    radio.sendValue("v_bat", V_Bat)
}
function Motor_Stop () {
    maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
    maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
    maqueen.motorStop(maqueen.Motors.All)
    x = 0
    y = 0
}
function _36GradLinks () {
    for (let index = 0; index < 600; index++) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 255)
    }
    maqueen.motorStop(maqueen.Motors.All)
}
function LED_Init () {
    strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
    LEDRing = neopixel.create(DigitalPin.P2, 24, NeoPixelMode.RGB)
    aktuelleFarbe = 0
    LEDRing.showRainbow(1, 360)
    LEDRing.show()
}
function fahrevorwärts () {
    maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, Math.constrain(Math.abs(x - y), 10, 255))
    maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, Math.constrain(Math.abs(x + y), 0, 255))
}
radio.onReceivedString(function (receivedString) {
    recieveString(receivedString)
})
radio.onReceivedValue(function (name, value) {
    serial.writeValue(name, value)
    if (name == "x") {
        x = value
    }
    if (name == "y") {
        y = value
    }
    if (y > 10) {
        if (hatHinderniss == 0) {
            fahrevorwärts()
        }
    } else if (y < -10) {
        fahrerückwärts()
    } else {
        Motor_Stop()
    }
    serial.writeValue("x1", x)
    serial.writeValue("y1", y)
    serial.writeValue("hinderniss", hatHinderniss)
})
function LEDFarbeÄndern () {
    if (aktuelleFarbe == 7) {
        aktuelleFarbe = 0
    } else {
        aktuelleFarbe = aktuelleFarbe + 1
    }
    if (aktuelleFarbe == 0) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
    } else if (aktuelleFarbe == 1) {
        strip.showColor(neopixel.colors(NeoPixelColors.Orange))
    } else if (aktuelleFarbe == 2) {
        strip.showColor(neopixel.colors(NeoPixelColors.Yellow))
    } else if (aktuelleFarbe == 3) {
        strip.showColor(neopixel.colors(NeoPixelColors.Green))
    } else if (aktuelleFarbe == 4) {
        strip.showColor(neopixel.colors(NeoPixelColors.Blue))
    } else if (aktuelleFarbe == 5) {
        strip.showColor(neopixel.colors(NeoPixelColors.Indigo))
    } else if (aktuelleFarbe == 6) {
        strip.showColor(neopixel.colors(NeoPixelColors.Violet))
    } else if (aktuelleFarbe == 7) {
        strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    } else {
    	
    }
    strip.show()
}
let hatHinderniss = 0
let aktuelleFarbe = 0
let LEDRing: neopixel.Strip = null
let strip: neopixel.Strip = null
let V_Bat = 0
let y = 0
let x = 0
let lastButton = ""
radio.setGroup(1)
LED_Init()
basic.showLeds(`
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    `)
basic.showLeds(`
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    `)
basic.forever(function () {
    if (maqueen.Ultrasonic(PingUnit.Centimeters) > 0 && maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
        maqueen.motorStop(maqueen.Motors.All)
        hatHinderniss = 1
    } else {
        hatHinderniss = 0
    }
    measureBattery()
})
