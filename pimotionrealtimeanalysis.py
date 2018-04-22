import numpy as np
import picamera
import picamera.array
import cv2
import time

class DetectMotion(picamera.array.PiRGBAnalysis):
    
    firstFrame = None
    countff = 0
    count = 0
    motion_detected = False
    
    def analyze(self, a):
       
        gray = cv2.cvtColor(a, cv2.COLOR_BGR2GRAY)
        #rawCapture.truncate(0)
        
        gray = cv2.GaussianBlur(gray, (21, 21), 0)
        #threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
        #cv2.imwrite('greythreshold.jpg', threshold)
        # if the first frame is None, initialize it
        if self.firstFrame is None:
            self.firstFrame = gray
            nameff = 'firstframe'+str(self.countff)+'.jpg'
            self.countff += 1
            cv2.imwrite(nameff,self.firstFrame)
            #continue
        if self.count == 6:
            
            self.firstFrame = gray
            # compute the absolute difference between the current frame and
            # first frame
        #cv2.imwrite('frame.jpg',fgmask)
        frameDelta = cv2.absdiff(self.firstFrame, gray)
        name2 = 'debugdelta'+str(self.count)+'.jpg'
        #cv2.imwrite(name2,frameDelta)
        thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]

        thresh = cv2.dilate(thresh, None, iterations=2)
        name = 'diff'+str(self.count)+'.jpg'
        cv2.imwrite(name,thresh)
        self.count += 1

        if cv2.countNonZero(thresh) > 20000 and self.count > 6:
            print('motion detected for frame '+name)
            cv2.imwrite('motion_frame'+str(self.count)+'.jpg',a)
            self.motion_detected = True
           

      
""" with picamera.PiCamera() as camera:
    stream = picamera.PiCameraCircularIO(camera, seconds=20)
    with DetectMotion(camera) as stream:
        camera.resolution = (640, 480)
        camera.framerate = 32
        time.sleep(0.1)
        camera.start_recording(
              stream, format='bgr')
        while True:
            camera.wait_recording(1)
            if stream.motion_detected is True:
                print('\nAbout to record motion...')
                camera.wait_recording(5)
                camera.stop_recording()
                stream.copy_to('motion_recorded.h264')
                break """