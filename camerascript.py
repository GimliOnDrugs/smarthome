import io
import random
import sys
from time import sleep
from picamera import PiCamera

message = sys.stdin.readline()

if message == 'take pic':
 camera = PiCamera() 
 camera.resolution = (1024, 768)    
 camera.start_preview()
# Camera warm-up time 
 sleep(2)
 camera.capture('foo.jpg')
else:

	print('nope')
