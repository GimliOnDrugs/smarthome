import io
import random
import sys
import picamera

message = sys.stdin.readline()


def motion_detected():
    # Randomly return True (like a fake motion detection routine)
    return random.randint(0, 10) == 0

if message == "start recording\n":
    camera = picamera.PiCamera()
    stream = picamera.PiCameraCircularIO(camera, seconds=20)
    camera.start_recording(stream, format='h264')
    try:

        while True:
            camera.wait_recording(1)
            if motion_detected():

                camera.wait_recording(10)
                stream.copy_to('motion.h264')
                print('video recorded')

                
    finally:
        camera.stop_recording()
