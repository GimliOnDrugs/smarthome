from threading import Thread
import time

cd = 60


def timeout():
    global cd
    global thread
    while cd > 0:
        cd = cd - 1
        time.sleep(1)
        print(cd)
        if cd == 55:
            cd =0
thread = Thread(target=timeout)

thread.start()