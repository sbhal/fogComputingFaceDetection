import cv2
import numpy
import numpy as np
import os
import collections
import operator
from PIL import Image
import sys
import cStringIO
from io import BytesIO
import base64

# Used for timing
import time

files = []
matcher = None
def create_opencv_image_from_stringio(img_stream, cv2_img_flag=0):
    img_stream.seek(0)
    img_array = np.asarray(bytearray(img_stream.read()), dtype=np.uint8)
    return cv2.imdecode(img_array, cv2_img_flag)

def create_opencv_image_from_url(url, cv2_img_flag=0):
    request = urlopen(url)
    img_array = np.asarray(bytearray(request.read()), dtype=np.uint8)
    return cv2.imdecode(img_array, cv2_img_flag)
    
def get_image(image_path):
    #return cv2.imread(image_path, cv2.CV_LOAD_IMAGE_GRAYSCALE)
    return create_opencv_image_from_url(image_path, 0);

def get_image_features(image):
    # Workadound for missing interfaces
    surf = cv2.FeatureDetector_create("SURF")
    surf.setInt("hessianThreshold", 100)
    surf_extractor = cv2.DescriptorExtractor_create("SURF")
    # Get keypoints from image
    keypoints = surf.detect(image, None)
    # Get keypoint descriptors for found keypoints
    keypoints, descriptors = surf_extractor.compute(image, keypoints)
    return keypoints, numpy.array(descriptors)

def train_index():
    # Prepare FLANN matcher
    flann_params = dict(algorithm = 1, trees = 4)
    matcher = cv2.FlannBasedMatcher(flann_params, {})

    # Train FLANN matcher with descriptors of all images
    curdir = os.path.dirname(os.path.abspath(__file__))
    
    #for f in os.listdir("img/"):
    for f in os.listdir(os.path.join(curdir,"img")):
        print "Processing " + f
        image = get_image("./img/%s" % (f,))
        keypoints, descriptors = get_image_features(image)
        matcher.add([descriptors])
        files.append(f)

    print "Training FLANN."
    matcher.train()
    print "Done."
    return matcher

def match_image(index, image):
    # Get image descriptors
    image = get_image(image)
    keypoints, descriptors = get_image_features(image)

    # Find 2 closest matches for each descriptor in image
    matches = index.knnMatch(descriptors, 2)
      
    # Cound matcher for each image in training set
    print "Counting matches..."
    count_dict = collections.defaultdict(int)
    for match in matches:
        # Only count as "match" if the two closest matches have big enough distance
        if match[0].distance / match[1].distance < 0.3:
            continue

        image_idx = match[0].imgIdx
        count_dict[files[image_idx]] += 1

    # Get image with largest count
    matched_image = max(count_dict.iteritems(), key=operator.itemgetter(1))[0]

    # Show results
    print "Images", files
    print "Counts: ", count_dict
    print "==========="
    print "Hit: ", matched_image
    print "==========="

    return matched_image

if __name__ == "__main__":
    #print "OpenCV Demo, OpenCV version " + cv2.__version__
    
    start_time = time.time()
    flann_matcher = train_index()
    #print "\nIndex generation took ", (time.time() - start_time), "s.\n"
    # ======================== Training done, image matching here ===============
    
    #start_time = time.time()
    #img = Image.open(cStringIO.StringIO(sys.argv[1]))
    #img = Image.open(BytesIO(sys.argv[1]))

    im = sys.stdin.read()
    fh = open("imageToSave.png", "wb")
    fh.write(im.decode('base64'))
    fh.close()
    #sys.stdout.write(im)
    
    #match_image(flann_matcher, "tst2.jpg")
    match_image(flann_matcher, im.decode('base64'))
    #print "Matching took", (time.time() - start_time), "s."
