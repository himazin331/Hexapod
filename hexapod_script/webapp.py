from flask import Flask, request
from servo_motor import ServoMotor
import time
import math

app = Flask(__name__, static_folder="../webcontrol", static_url_path="")

# ページ読込
@app.route("/")
def index():
    return app.send_static_file("index.html")

@app.route("/cameraMoveX", methods=["POST"])
def cameraMoveX():
    if "POST" == request.method:
        xdeg = math.floor(float(request.form["c_xdeg"]))
        print("POST Xdeg：", xdeg)
        if xdeg < 0:
            print("Move Xdeg：", xdeg+180)
            servoMotors[0].setAngle(xdeg+180)
        else:
            print("Move Xdeg：", xdeg)
            servoMotors[0].setAngle(xdeg)
        print("Servo Xdeg：", servoMotors[0].getAngle())

    return ""

servoMotors = []
if __name__ == "__main__":
    servoMotors.append(ServoMotor(Channel=0))

    app.run(host="0.0.0.0", port=8000, debug=True)