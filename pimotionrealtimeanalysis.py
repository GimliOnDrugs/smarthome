import numpy as np
import picamera
import picamera.array
import cv2
import time

class DetectMotion(picamera.array.PiRGBAnalysis):
    firstFrame = cv2.imread('first_frame.jpg',0)
    countff = 0
    count = 0
    count2 = 0
    def analyze(self, a):
        
        #print('hi')
        gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
        #rawCapture.truncate(0)
        
        gray = cv2.GaussianBlur(gray, (41, 41), 0)
        self.firstFrame = cv2.GaussianBlur(self.firstFrame.copy(),(41,41),0)
        cv2.imwrite('gray.jpg',gray)
        #threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
        #cv2.imwrite('greythreshold.jpg', threshold)
        # if the first frame is None, initialize it
       """  if self.firstFrame is None:
            self.firstFrame = gray
            nameff = 'firstframe'+str(self.countff)+'.jpg'
            self.countff += 1
            cv2.imwrite(nameff,self.firstFrame) """
            #continue

            # compute the absolute difference between the current frame and
            # first frame
        #cv2.imwrite('frame.jpg',fgmask)
        frameDelta = cv2.absdiff(self.firstFrame, gray)
        name2 = 'debugdelta'+str(self.count)+'.jpg'
        cv2.imwrite(name2,gray)
        thresh = cv2.threshold(frameDelta, 50, 255, cv2.THRESH_BINARY)[1]

        thresh = cv2.dilate(thresh, None, iterations=2)
        name = 'diff'+str(self.count)+'.jpg'
        cv2.imwrite(name,thresh)
        self.count += 1

        if cv2.countNonZero(thresh) > 30000:
            print('motion detected for frame '+name)

      

with picamera.PiCamera() as camera:
    with DetectMotion(camera) as stream:
        camera.resolution = (640, 480)
        camera.framerate = 16
        time.sleep(0.1)
        camera.start_recording(
              stream, format='bgr')
        camera.wait_recording(5)
        camera.stop_recording()