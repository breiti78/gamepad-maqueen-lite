def LED_Init():
    global strip, LEDFarben, aktuelleFarbe
    strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
    LEDFarben = ["rot",
        "orange",
        "gelb",
        "grün",
        "blau",
        "indigo",
        "blauviolett",
        "magenta"]
    aktuelleFarbe = 0

def on_received_string(receivedString):
    global lastButton
    serial.write_line(receivedString)
    if receivedString == "A":
        if receivedString != lastButton:
            _36GradLinks()
    elif receivedString == "B":
        pass
    elif receivedString == "P16":
        maqueen.write_led(maqueen.LED.LED_LEFT, maqueen.LEDswitch.TURN_ON)
    elif receivedString == "P14":
        maqueen.write_led(maqueen.LED.LED_RIGHT, maqueen.LEDswitch.TURN_ON)
    elif receivedString.includes("FW"):
        if hatHinderniss == 0:
            maqueen.motor_run(maqueen.Motors.ALL,
                maqueen.Dir.CW,
                (parse_float(receivedString.substr(2, 10)) - 1) / 2)
    elif receivedString.includes("BW"):
        maqueen.motor_run(maqueen.Motors.ALL,
            maqueen.Dir.CCW,
            (parse_float(receivedString.substr(2, 10)) - 1) / 2)
    elif receivedString == "L":
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 20)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 100)
    elif receivedString == "R":
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 100)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 20)
    elif receivedString == "P15":
        if receivedString != lastButton:
            LEDFarbeÄndern()
    else:
        maqueen.write_led(maqueen.LED.LED_LEFT, maqueen.LEDswitch.TURN_OFF)
        maqueen.write_led(maqueen.LED.LED_RIGHT, maqueen.LEDswitch.TURN_OFF)
        maqueen.motor_stop(maqueen.Motors.ALL)
    lastButton = receivedString
radio.on_received_string(on_received_string)

def LEDFarbeÄndern():
    global aktuelleFarbe
    if aktuelleFarbe == 7:
        aktuelleFarbe = 0
    else:
        aktuelleFarbe = aktuelleFarbe + 1
    if aktuelleFarbe == 0:
        strip.show_color(neopixel.colors(NeoPixelColors.RED))
    elif aktuelleFarbe == 1:
        strip.show_color(neopixel.colors(NeoPixelColors.ORANGE))
    elif aktuelleFarbe == 2:
        strip.show_color(neopixel.colors(NeoPixelColors.YELLOW))
    elif aktuelleFarbe == 3:
        strip.show_color(neopixel.colors(NeoPixelColors.GREEN))
    elif aktuelleFarbe == 4:
        strip.show_color(neopixel.colors(NeoPixelColors.BLUE))
    elif aktuelleFarbe == 5:
        strip.show_color(neopixel.colors(NeoPixelColors.INDIGO))
    elif aktuelleFarbe == 6:
        strip.show_color(neopixel.colors(NeoPixelColors.VIOLET))
    elif aktuelleFarbe == 7:
        strip.show_color(neopixel.colors(NeoPixelColors.PURPLE))
    else:
        pass
    strip.show()
def _36GradLinks():
    for index in range(600):
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CCW, 255)
    maqueen.motor_stop(maqueen.Motors.ALL)
hatHinderniss = 0
lastButton = ""
aktuelleFarbe = 0
LEDFarben: List[str] = []
strip: neopixel.Strip = None
radio.set_group(1)
LED_Init()


def on_forever():
    global hatHinderniss
    if maqueen.ultrasonic(PingUnit.CENTIMETERS) > 0 and maqueen.ultrasonic(PingUnit.CENTIMETERS) < 10:
        maqueen.motor_stop(maqueen.Motors.ALL)
        hatHinderniss = 1
    else:
        hatHinderniss = 0
        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 0 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
                maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
                maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
        else:
                if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 0 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
                    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 0)
                    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
                    if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
                        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 0)
                        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
                else:
                    if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
                        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
                        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
                        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
                            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
                            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
                        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
                            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
                        else:
                            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
basic.forever(on_forever)

