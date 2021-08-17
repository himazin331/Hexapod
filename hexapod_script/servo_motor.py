import Adafruit_PCA9685 as ap

class ServoMotor:
    def __init__(self, Channel):
        self.Channel = Channel

        #initialize PCA9685
        self.PWM = ap.PCA9685(address=0x40) 
        self.PWM.set_pwm_freq(60) # 60Hz

    def setAngle(self, angle):
        pulse = int((650 - 150) * angle / 180 + 150)
        print("pulse:", pulse, "deg:", angle)
        self.PWM.set_pwm(self.Channel, 0, pulse)

    def getAngle(self):
        return self.PWM.get_pwm(self.Channel)

    def cleanup(self):
        self.setAngle(10)