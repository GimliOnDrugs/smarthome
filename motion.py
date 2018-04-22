import io
import random
import picamera
from picamera.array import PiRGBArray
from PIL import Image
import cv2

firstFrame = None
count = 0
countff = 0
lalala = None


def detect_motion(camera):
    global firstFrame
    global count
    global countff
    rawCapture = PiRGBArray(camera)
    camera.capture(rawCapture, format="bgr", use_video_port=False)
    gray = cv2.cvtColor(rawCapture.array, cv2.COLOR_BGR2GRAY)
    rawCapture.truncate(0)
    gray = cv2.GaussianBlur(gray, (21, 21), 0)
    threshold = cv2.threshold(gray, 20, 255, cv2.THRESH_TOZERO)[1]
    # cv2.imwrite('greythreshold.jpg', threshold)
    # if the first frame is None, initialize it
    if firstFrame is None:
        firstFrame = gray
        nameff = 'firstframe'+str(countff)+'.jpg'
        countff += 1
        # cv2.imwrite(nameff,firstFrame)
        # continue

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
        return True

with picamera.PiCamera() as camera:
    stream = picamera.PiCameraCircularIO(camera, seconds=10)
    camera.start_recording(stream, format='h264')
    try:
        while True:
            camera.wait_recording(1)
            if detect_motion(camera):
                print('Motion detected!')
                # As soon as we detect motion, split the recording to
                # record the frames "after" motion
                camera.split_recording('after.h264')
                # Write the 10 seconds "before" motion to disk as well
                stream.copy_to('before.h264', seconds=10)
                stream.clear()
                # Wait until motion is no longer detected, then split
                # recording back to the in-memory circular buffer
                while detect_motion(camera):
                    camera.wait_recording(1)
                print('Motion stopped!')
                camera.split_recording(stream)
    finally:
        camera.stop_recording()
