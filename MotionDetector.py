from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import numpy
import io


class MotionDetector:

    def __init__(self, picamera):
        self.picamera = picamera

    def detectMotion(self, stream):
        camera = self.picamera
        camera.framerate = 32
       	rawCapture = PiRGBArray(camera)
        # allow the camera to warmup
        firstFrame = None
        # capture frames from the camera
        for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=False):
            gray = cv2.cvtColor(frame.array, cv2.COLOR_BGR2GRAY)
            rawCapture.truncate(0)
            gray = cv2.GaussianBlur(gray, (21, 21), 0)
            threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
            cv2.imwrite('greythreshold.jpg', threshold)
            # if the first frame is None, initialize it
            if firstFrame is None:
                firstFrame = gray
                nameff = 'firstframe'+str(countff)+'.jpg'
                countff += 1
                # cv2.imwrite(nameff,firstFrame)
                continue

            # compute the absolute difference between the current frame and
            # first frame
            frameDelta = cv2.absdiff(firstFrame, gray)
            name2 = 'debugdelta'+str(count)+'.jpg'

            thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]

            thresh = cv2.dilate(thresh, None, iterations=2)

            name = 'diff'+str(count)+'.jpg'
            count += 1

            if cv2.countNonZero(thresh) > 30000:
                print('motion detected for frame '+name)
                camera.wait_recording(10)
                stream.copy_to('motion.h264')
                # if sys.stdin.readline() == "keep going\n":
                print('video recorded')
                return True
