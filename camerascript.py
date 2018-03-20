import io
import random
import sys
import picamera
import random

message = sys.stdin.readline()
def motion_detected():
    # Randomly return True (like a fake motion detection routine)
    return random.randint(0, 10) == 0

if message == "take pic\n":
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
    
else:
    print('ghey')
