import numpy as np
import picamera
import picamera.array
import cv2
import time

class DetectMotion(picamera.array.PiRGBAnalysis):
    firstFrame = None
    countff = 0
    count = 0
    def analyze(self, a):
       
        gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
        #rawCapture.truncate(0)
        
        gray = cv2.GaussianBlur(gray, (31, 31), 0)
        #threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
        #cv2.imwrite('greythreshold.jpg', threshold)
        # if the first frame is None, initialize it
        if self.firstFrame is None:
            self.firstFrame = gray
            nameff = 'firstframe'+str(self.countff)+'.jpg'
            self.countff += 1
            cv2.imwrite(nameff,self.firstFrame)
            #continue
        if self.count > 6:
            self.firstFrame = gray
            # compute the absolute difference between the current frame and
            # first frame
        #cv2.imwrite('frame.jpg',fgmask)
        frameDelta = cv2.absdiff(self.firstFrame, gray)
        name2 = 'debugdelta'+str(self.count)+'.jpg'
        #cv2.imwrite(name2,gray)
        thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]

        thresh = cv2.dilate(thresh, None, iterations=2)
        name = 'diff'+str(self.count)+'.jpg'
        cv2.imwrite(name,thresh)
        self.count += 1

        if cv2.countNonZero(thresh) > 30000:
            print('motion detected for frame '+name)

      

with picamera.PiCamera() as camera:
    with DetectMotion(camera) as stream:
        camera.resolution = (640, 480)
        time.sleep(2)
        camera.start_recording(
              stream, format='bgr')
        camera.wait_recording(10)
        camera.stop_recording()