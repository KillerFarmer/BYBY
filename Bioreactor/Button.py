#!/usr/bin/env python
import RPi.GPIO as GPIO
from ControlSensorI import ControlSensorI

class Button(ControlSensorI):
    def __init__(self,BtnPin,func, bouncetime=200):
        self.pin = BtnPin 
        self.bouncetime=200
        self.setup(func)

    def setup(self, func):
        GPIO.setmode(GPIO.BOARD)       # Numbers GPIOs by physical location
        GPIO.setup(self.pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)    # Set BtnPin's mode is input, and pull up to high level(3.3V)
        GPIO.add_event_detect(self.pin, GPIO.BOTH, callback=func, bouncetime=self.bouncetime)

    def destroy(self):
        GPIO.cleanup()

    def getValue(self):
        pass
