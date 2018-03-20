import io
import random
import sys
from time import sleep
import picamera

message = sys.stdin.readline()

if message == "take pic\n":

    camera = picamera.PiCamera()
    camera.resolution = (640, 480)
    camera.start_recording('my_video.h264')

    camera.wait_recording(60)
    camera.stop_recording()
    print('frocio')
else:
    print('ghey')
