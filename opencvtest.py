from picamera.array import PiRGBArray
from picamera import PiCamera
import time
import cv2
import numpy
import io

# initialize the camera and grab a reference to the raw camera capture
camera = PiCamera()
#camera.resolution = (640, 480)
camera.framerate = 32
rawCapture = PiRGBArray(camera)
#, size=(640, 480))
stream = io.BytesIO()


#print(background)

# allow the camera to warmup
time.sleep(0.1)
firstFrame = None
count = 0
countff = 0
# capture frames from the camera
for frame in camera.capture_continuous(rawCapture, format="bgr", use_video_port=False):
#for frame in camera.capture_continuous(rawCapture, format='bgr'):
	gray = cv2.cvtColor(frame.array, cv2.COLOR_BGR2GRAY)
	#stream.truncate()
	#stream.seek(0)
	rawCapture.truncate(0)
	gray = cv2.GaussianBlur(gray, (21, 21), 0)
	threshold = cv2.threshold(gray,20,255,cv2.THRESH_TOZERO)[1]
	cv2.imwrite('greythreshold.jpg',threshold)
	# if the first frame is None, initialize it
	if firstFrame is None:
		firstFrame = gray
		nameff = 'firstframe'+str(countff)+'.jpg'
		countff+=1
		#cv2.imwrite(nameff,firstFrame)
		continue

	# compute the absolute difference between the current frame and
	# first frame
	frameDelta = cv2.absdiff(firstFrame, gray)
	name2 = 'debugdelta'+str(count)+'.jpg'
	#cv2.imwrite(name2,frameDelta)
	thresh = cv2.threshold(frameDelta, 20, 255, cv2.THRESH_BINARY)[1]
	#thresh = cv2.adaptiveThreshold(frameDelta,255,cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY,11,2)
	#thresh =  cv2.threshold(frameDelta,20, 255, cv2.THRESH_BINARY+cv2.THRESH_OTSU)[1]
	thresh = cv2.dilate(thresh, None, iterations=2)

	name = 'diff'+str(count)+'.jpg'
	count+=1
	#cv2.imwrite(name,thresh)
	if cv2.countNonZero(thresh) > 30000:
		print('motion detected for frame '+name)

#	print('value diff of frameDelta number '+count+ ' and this is value '+value)

#	cnts = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)[0]
#	for c in cnts:
		# if the contour is too small, ignore it
#		if cv2.contourArea(c) < conf["min_area"]:
#			continue
 
		# compute the bounding box for the contour, draw it on the frame,
		# and update the text
#		(x, y, w, h) = cv2.boundingRect(c)
#		cv2.rectangle(frame.array, (x, y), (x + w, y + h), (0, 255, 0), 2)
#		cv2.imwrite('frame'+str(count)+'.jpg',frame.array)
	# dilate the thresholded image to fill in holes, then find contours
	# on thresholded image
	#(cnts, _) = cv2.findContours(thresh.copy(), cv2.RETR_EXTERNAL,
	#	cv2.CHAIN_APPROX_SIMPLE)

	# loop over the contours
	#for c in cnts:
		# if the contour is too small, ignore it
	#	if cv2.contourArea(c) < args["min_area"]:
	#		continue
	
		# compute the bounding box for the contour, draw it on the frame,
		# and update the text
	#	(x, y, w, h) = cv2.boundingRect(c)
	#	cv2.rectangle(frame, (x, y), (x + w, y + h), (0, 255, 0), 2)
	#	text = "Occupied"
	
	#rawCapture.truncate(0)
#	break;

