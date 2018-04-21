import numpy as np
import picamera
import picamera.array
import cv2

class DetectMotion(picamera.array.PiRGBAnalysis):
    firstFrame = None
    def analyze(self, a):
        gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
        #rawCapture.truncate(0)
        print('hi')
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        #threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
        #cv2.imwrite('greythreshold.jpg', threshold)
        # if the first frame is None, initialize it
        if firstFrame is None:
            firstFrame = gray
            nameff = 'firstframe'+str(countff)+'.jpg'
            countff += 1
            cv2.imwrite(nameff,firstFrame)
            #continue

            # compute the absolute difference between the current frame and
            # first frame
        frameDelta = cv2.absdiff(firstFrame, gray)
        name2 = 'debugdelta'+str(count)+'.jpg'

        thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]

        thresh = cv2.dilate(thresh, None, iterations=2)
        name = 'diff'+str(count)+'.jpg'
        cv2.imwrite(name,thresh)
        count += 1

        if cv2.countNonZero(thresh) > 30000:
            print('motion detected for frame '+name)

      

with picamera.PiCamera() as camera:
    with DetectMotion(camera) as output:
        camera.resolution = (640, 480)
        camera.start_recording(
              'video.bgr', format='bgr')
        camera.wait_recording(30)
        camera.stop_recording()