import base64
import cv2
import math
import numpy as np
from io import BytesIO
from PIL import Image

def deserialize(data_url):
    bytes = base64.b64decode(data_url)
    nbBytes = len(bytes)
    print('Number of bytes ' + str(nbBytes))
    # img = np.frombuffer(bytes, dtype='int8')

    img = Image.open(BytesIO(bytes))
    img = np.array(img)
    print('Vector image shape ' + str(img.shape))

    cv2.imshow('lol', img)
    cv2.waitKey(0)
    cv2.destroyAllWindows()

# byte64 binary image
bitmap = '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' 
deserialize(bitmap)