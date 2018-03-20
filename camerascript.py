import io
import random
import sys
import picamera
import random

message = sys.stdin.readline()


def motion_detected():
    # Randomly return True (like a fake motion detection routine)
    return random.randint(0, 10) == 0


camera = picamera.PiCamera()
stream = picamera.PiCameraCircularIO(camera, seconds=20)
camera.start_recording(stream, format='h264')

if message == "take pic\n":
    camera = picamera.PiCamera()
    camera.resolution = (640, 480)
    print('message')
    camera.start_recording('my_video.h264')
    camera.wait_recording(20)
    print('camera stops recording')
    camera.stop_recording()

    """ try:
        while True:
            camera.wait_recording(1)
            if motion_detected():
                # Keep recording for 10 seconds and only then write the
                # stream to disk
                camera.wait_recording(10)
                stream.copy_to('motion.h264')

    finally:
        print('camera stops recording')
        camera.stop_recording() """

else:
    print('ghey')
