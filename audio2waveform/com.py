from skimage.measure import compare_ssim
#from scipy.misc import imread

import matplotlib.image as mpimg
import numpy as np
import sys

arg = sys.argv
if len(arg) == 3:
    src1 = arg[1]
    src2 = arg[2]

img1 = mpimg.imread(src1)
img2 = mpimg.imread(src2)
 
img2 = np.resize(img2, (img1.shape[0], img1.shape[1], img1.shape[2]))
 
#print(img2.shape)
#print(img1.shape)
ssim = compare_ssim(img1, img2, multichannel=True)
 
print(ssim)