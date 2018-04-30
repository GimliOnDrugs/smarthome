import io
import random
import picamera
from picamera.array import PiRGBArray
import cv2
import time
import datetime
import sys

firstFrame = None  # this is the first frame picked and will be the reference model
count = 0
countff = 0
# pointer to the time first frame was picked in order
# to change it at regular intervals for light changes
timeFirstFrame = datetime.datetime.now().minute
frame_count = 0
detected = False
face_cascade = cv2.CascadeClassifier('./haarcascade_frontalface_default.xml')


def detect_motion(camera):
    global firstFrame
    global count
    global countff
    global timeFirstFrame
    global detected
    global frame_count
    rawCapture = PiRGBArray(camera)
    # picamera method to get a frame in the current video as a numpy array for OpenCV
    camera.capture(rawCapture, format="bgr", use_video_port=True)
    current_frame = cv2.cvtColor(rawCapture.array, cv2.COLOR_BGR2GRAY)
    frame_count += 1
    rawCapture.truncate(0)
    #current_frame = cv2.GaussianBlur(current_frame, (21, 21), 0)
    face_rects = face_cascade.detectMultiScale(current_frame, 1.3, 5)
    for (x, y, w, h) in face_rects:
        cv2.rectangle(current_frame, (x, y), (x+w, y+h), (0, 255, 0), 3)
        cv2.imwrite('facedetected.jpg',current_frame)

with picamera.PiCamera() as camera:
        stream = picamera.PiCameraCircularIO(camera, seconds=5)
        camera.start_recording(stream, format='h264')
        try:
            while True:
                detect_motion(camera)
                  
        finally:
            camera.stop_recording()
