#!/home/ubuntu/git/audio2waveform/venv/bin/python
#coding=utf-8
# from https://gist.github.com/moeseth/130cd92dc47c56c47030
# time consume is up to video length

from pydub import AudioSegment
from PIL import Image, ImageDraw
import numpy as np
import sys

AudioSegment.converter = "E:\\project\\audio2waveform\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.ffmpeg = "E:\\project\\audio2waveform\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.ffprobe ="E:\\project\\audio2waveform\\ffmpeg\\bin\\ffprobe.exe"

arg = sys.argv
if len(arg) == 2:
    src = arg[1]
    filename = src[:src.rfind('.')]
else:
    filename = "2_30"
    src = "./" + filename + ".mp3"
print(src)
#sys.exit(0)
audio = AudioSegment.from_file(src)
data = np.fromstring(audio._data, np.int16)
fs = audio.frame_rate

# color_scalar = (169, 171, 172) #coloring bar
color_black = (0, 0, 0)
color_red = (255, 0, 0)
color_scalar = color_black

BARS = 100
BAR_HEIGHT = 200
LINE_WIDTH = 5 # considering noises, this should not be too small

length = len(data)
RATIO = length / BARS

count = 0
maximum_item = 0
max_array = []
highest_line = 0

for d in data:
    if count < RATIO:
        count = count + 1

        if abs(d) > maximum_item:
            maximum_item = abs(d)
    else:
        max_array.append(maximum_item)

        if maximum_item > highest_line:
            highest_line = maximum_item

        maximum_item = 0
        count = 1

line_ratio = highest_line / BAR_HEIGHT

im = Image.new('RGBA', (BARS * LINE_WIDTH, BAR_HEIGHT), (255, 255, 255, 1))
#im = Image.new('RGBA', (BARS * LINE_WIDTH, BAR_HEIGHT), (255, 255, 255, 0)) # white background
draw = ImageDraw.Draw(im)

current_x = 1

for item in max_array:
    item_height = item / line_ratio

    # symmetric at middle
    current_y = (BAR_HEIGHT - item_height)/2
    draw.line((current_x, current_y, current_x, current_y + item_height), fill=color_scalar, width=LINE_WIDTH)

    # align to bottom
    #current_y = BAR_HEIGHT
    #draw.line((current_x, current_y, current_x, current_y - item_height), fill=color_scalar, width=LINE_WIDTH)

    current_x = current_x + LINE_WIDTH

im.save(filename + ".png")
#im.show()
