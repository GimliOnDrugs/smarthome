import io
import random
import sys
from time import sleep
from picamera import PiCamera

message = sys.stdin.readline()

if message == "take pic\n":




camera = picamera.PiCamera()
stream = picamera.PiCameraCircularIO(camera, seconds=20)
camera.start_recording(stream, format='h264')
try:
    while True:
      
            stream.copy_to('motion.h264')
finally:
    camera.stop_recording()
    print('pic taken')
else:
    f = open("guru99.txt", "w+")
    f.write(message)
    f.write('\n'+str(message == 'take pic'))
    f.close()
    print('nope')
