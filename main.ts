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
function _36GradLinks () {
    for (let index = 0; index < 600; index++) {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CCW, 255)
    }
    maqueen.motorStop(maqueen.Motors.All)
}
function LED_Init () {
    strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
    LEDFarben = [
    "rot",
    "orange",
    "gelb",
    "grün",
    "blau",
    "indigo",
    "blauviolett",
    "magenta"
    ]
    aktuelleFarbe = 0
}
radio.onReceivedString(function (receivedString) {
    serial.writeLine(receivedString)
    if (receivedString == "A") {
        if (receivedString != lastButton) {
            _36GradLinks()
        }
    } else if (receivedString == "B") {
        if (receivedString != lastButton) {
            FollowLine()
        }
    } else if (receivedString == "P16") {
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOn)
    } else if (receivedString == "P14") {
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOn)
    } else if (receivedString.includes("FW")) {
        if (hatHinderniss == 0) {
            maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CW, (parseFloat(receivedString.substr(2, 10)) - 1) / 2)
        }
    } else if (receivedString.includes("BW")) {
        maqueen.motorRun(maqueen.Motors.All, maqueen.Dir.CCW, (parseFloat(receivedString.substr(2, 10)) - 1) / 2)
    } else if (receivedString == "L") {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 20)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 100)
    } else if (receivedString == "R") {
        maqueen.motorRun(maqueen.Motors.M1, maqueen.Dir.CW, 100)
        maqueen.motorRun(maqueen.Motors.M2, maqueen.Dir.CW, 20)
    } else if (receivedString == "P15") {
        if (receivedString != lastButton) {
            LEDFarbeÄndern()
        }
    } else {
        maqueen.writeLED(maqueen.LED.LEDLeft, maqueen.LEDswitch.turnOff)
        maqueen.writeLED(maqueen.LED.LEDRight, maqueen.LEDswitch.turnOff)
        maqueen.motorStop(maqueen.Motors.All)
    }
    lastButton = receivedString
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
let lastButton = ""
let aktuelleFarbe = 0
let LEDFarben: string[] = []
let strip: neopixel.Strip = null
radio.setGroup(1)
LED_Init()
basic.forever(function () {
    if (maqueen.Ultrasonic(PingUnit.Centimeters) > 0 && maqueen.Ultrasonic(PingUnit.Centimeters) < 10) {
        maqueen.motorStop(maqueen.Motors.All)
        hatHinderniss = 1
    } else {
        hatHinderniss = 0
    }
})
