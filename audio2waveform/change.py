
from pydub import AudioSegment
from PIL import Image, ImageDraw
import numpy as np
import sys

AudioSegment.converter = "E:\\project\\audio2waveform\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.ffmpeg = "E:\\project\\audio2waveform\\ffmpeg\\bin\\ffmpeg.exe"
AudioSegment.ffprobe ="E:\\project\\audio2waveform\\ffmpeg\\bin\\ffprobe.exe"

sound = AudioSegment.from_mp3("E:\\project\\audio2waveform\\2_30.mp3")
sound.export("E:\\project\\audio2waveform\\res.wav",format ='wav')