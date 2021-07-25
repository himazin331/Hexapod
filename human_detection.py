import cv2
import numpy as np

class HumanDetection():
    def __init__(self, cascade_file):
        # 人検出器セット
        self.detector = cv2.CascadeClassifier(cascade_file)

    # 人物検出
    def detect(self, frame):
        frame = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        found = self.detector.detectMultiScale(frame)

        return found