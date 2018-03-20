import io
import random
import sys
from time import sleep
import picamera

message = sys.stdin.readline()

if message == "take pic\n":
    camera = picamera.PiCamera()
    stream = picamera.PiCameraCircularIO(camera, seconds=20)
    camera.start_recording(stream, format='h264')
    try:
      while True:
        camera.wait_recording(1)
        if motion_detected():
            # Keep recording for 10 seconds and only then write the
            # stream to disk
            camera.wait_recording(10)
            stream.copy_to('motion.h264')
    finally:
        camera.stop_recording()
        print('pic taken')
