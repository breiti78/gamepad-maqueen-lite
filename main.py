def FollowLine():
    if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 0 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
    elif maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 0 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 0)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 0)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 255)
    elif maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 1:
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
        if maqueen.read_patrol(maqueen.Patrol.PATROL_LEFT) == 1 and maqueen.read_patrol(maqueen.Patrol.PATROL_RIGHT) == 0:
            maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        else:
            maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CW, 0)
def recieveString(receievedString: str):
    global lastButton
    serial.write_line(receievedString)
    if receievedString == "A":
        if receievedString != lastButton:
            _36GradLinks()
    elif receievedString == "B":
        pass
    elif receievedString == "P16":
        maqueen.write_led(maqueen.LED.LED_LEFT, maqueen.LEDswitch.TURN_ON)
    elif receievedString == "P14":
        maqueen.write_led(maqueen.LED.LED_RIGHT, maqueen.LEDswitch.TURN_ON)
    elif receievedString == "P15":
        if receievedString != lastButton:
            LEDFarbeÄndern()
    else:
        Motor_Stop()
    lastButton = receievedString
def fahrerückwärts():
    maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CCW, x - y)
    maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CCW, x + y)
def measureBattery():
    global V_Bat
    V_Bat = pins.analog_read_pin(AnalogReadWritePin.P0) * 1000 / 340
    radio.send_value("v_bat", V_Bat)
def Motor_Stop():
    global x, y
    maqueen.write_led(maqueen.LED.LED_LEFT, maqueen.LEDswitch.TURN_OFF)
    maqueen.write_led(maqueen.LED.LED_RIGHT, maqueen.LEDswitch.TURN_OFF)
    maqueen.motor_stop(maqueen.Motors.ALL)
    x = 0
    y = 0
def _36GradLinks():
    for index in range(600):
        maqueen.motor_run(maqueen.Motors.M1, maqueen.Dir.CW, 255)
        maqueen.motor_run(maqueen.Motors.M2, maqueen.Dir.CCW, 255)
    maqueen.motor_stop(maqueen.Motors.ALL)
def LED_Init():
    global strip, LEDRing, aktuelleFarbe
    strip = neopixel.create(DigitalPin.P15, 4, NeoPixelMode.RGB)
    LEDRing = neopixel.create(DigitalPin.P2, 24, NeoPixelMode.RGB)
    aktuelleFarbe = 0
    LEDRing.show_rainbow(1, 360)
    LEDRing.show()
def fahrevorwärts():
    maqueen.motor_run(maqueen.Motors.M2,
        maqueen.Dir.CW,
        Math.constrain(abs(x - y), 10, 255))
    maqueen.motor_run(maqueen.Motors.M1,
        maqueen.Dir.CW,
        Math.constrain(abs(x + y), 0, 255))

def on_received_string(receivedString):
    recieveString(receivedString)
radio.on_received_string(on_received_string)

def on_received_value(name, value):
    global x, y
    serial.write_value(name, value)
    if name == "x":
        x = value
    if name == "y":
        y = value
    if y > 10:
        if hatHinderniss == 0:
            fahrevorwärts()
    elif y < -10:
        fahrerückwärts()
    else:
        Motor_Stop()
    serial.write_value("x1", x)
    serial.write_value("y1", y)
    serial.write_value("hinderniss", hatHinderniss)
radio.on_received_value(on_received_value)

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
hatHinderniss = 0
aktuelleFarbe = 0
LEDRing: neopixel.Strip = None
strip: neopixel.Strip = None
V_Bat = 0
y = 0
x = 0
lastButton = ""
radio.set_group(1)
LED_Init()
basic.show_leds("""
    . . . . .
    . # . # .
    . . . . .
    # . . . #
    . # # # .
    """)
basic.show_leds("""
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    . . . . .
    """)

def on_forever():
    global hatHinderniss
    if maqueen.ultrasonic(PingUnit.CENTIMETERS) > 0 and maqueen.ultrasonic(PingUnit.CENTIMETERS) < 10:
        maqueen.motor_stop(maqueen.Motors.ALL)
        hatHinderniss = 1
    else:
        hatHinderniss = 0
    measureBattery()
basic.forever(on_forever)
