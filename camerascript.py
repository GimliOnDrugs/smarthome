import io
import random
import sys
from time import sleep
from picamera import PiCamera

message = sys.stdin.readline()

if message == "take pic\n":
    """ print(message == 'take pic', ' ', message) """

    camera = PiCamera()
    camera.resolution = (1024, 768)
    camera.start_preview()
# Camera warm-up time
    sleep(2)
    camera.capture('foo.jpg')
    print('pic taken')
else:
    f = open("guru99.txt", "w+")
    f.write(message)
    f.write('\n'+str(message=='take pic'))
    f.close()
    print('nope')
