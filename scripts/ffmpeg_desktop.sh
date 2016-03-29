ffmpeg -f x11grab -r 15 -s 460x420 -i :0.0+0,0 -vcodec rawvideo -pix_fmt rgb24 -threads 0 -f v4l2 /dev/video0
