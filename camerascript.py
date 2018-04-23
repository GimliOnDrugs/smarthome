import io
import random
import picamera
from picamera.array import PiRGBArray
import cv2
import time
import datetime
import sys

firstFrame = None
count = 0
countff = 0
timeFirstFrame = None




def detect_motion(camera):
    global firstFrame
    global count
    global countff
    global timeFirstFrame 
    timeFirstFrame = datetime.datetime.now().minute()
    print(timeFirstFrame)
    rawCapture = PiRGBArray(camera)
    camera.capture(rawCapture, format="bgr", use_video_port=True) #picamera method to get a frame in the current video as a numpy array for OpenCV
    current_frame = cv2.cvtColor(rawCapture.array, cv2.COLOR_BGR2GRAY) 
    rawCapture.truncate(0)
    current_frame = cv2.GaussianBlur(current_frame, (21, 21), 0)    
    # if the first frame is None, initialize it: first frame is the static backbround used for comparing other frames
    if firstFrame is None or updateBackgroundModel(timeFirstFrame):
        firstFrame = current_frame
        nameff = 'firstframe'+str(countff)+'.jpg'
        countff += 1
        cv2.imwrite(nameff,firstFrame)
        # continue
    if count == 6: #first few frames are way darker the average
        firstFrame = current_frame

    # compute the absolute difference between the current frame and
    # first frame
    frameDelta = cv2.absdiff(firstFrame, current_frame)
    name2 = 'debugdelta'+str(count)+'.jpg'

    thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]

    thresh = cv2.dilate(thresh, None, iterations=2)

    name = 'diff'+str(count)+'.jpg'
    count += 1

    if cv2.countNonZero(thresh) > 30000:
        print('motion detected for frame '+name)
        cv2.imwrite(name,thresh)
        return True

def updateBackgroundModel(timeFirstFrame):
    return datetime.datetime.now()-timeFirstFrame == 10 #update background model every 10 minutes 

with picamera.PiCamera() as camera:
    stream = picamera.PiCameraCircularIO(camera, seconds=10)
    if(sys.stdin.readline() == "start recording\n")
    camera.start_recording(stream, format='h264')
    try:
        while True:
            camera.wait_recording(1)
            if detect_motion(camera):
                print('Motion detected!')
                while detect_motion(camera):
                    camera.wait_recording(1)
                print('Motion stopped!')
                stream.copy_to('motion.h264')
                print('video recorded')
    finally:
        camera.stop_recording()
