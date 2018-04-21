import io
import random
import sys
import picamera
import MotionDetector
message = sys.stdin.readline()

camera = picamera.PiCamera()


motionDetector = MotionDetector(camera)





if message == "start recording\n":
    stream = picamera.PiCameraCircularIO(camera, seconds=20)
    camera.start_recording(stream, format='h264')
    try:

        while True:
            camera.wait_recording(1)
            motionDetector.detectMotion(stream)
           # if motion_detected():

                """ camera.wait_recording(10)
                stream.copy_to('motion.h264')
                print('video recorded')
                camera.stop_recording()
                if sys.stdin.readline() == "keep going\n":
                    stream = picamera.PiCameraCircularIO(camera, seconds=20)
                    camera.start_recording(stream, format='h264') """

    finally:
        camera.stop_recording()
