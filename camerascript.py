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
    print('stream started')

try:
    while True:

        stream.copy_to('motion.h264')
finally:
    camera.stop_recording()
    print('pic taken')
