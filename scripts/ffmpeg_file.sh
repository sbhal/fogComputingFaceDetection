ffmpeg -re -i ../apps/app1/feud.mp4 -f v4l2 -vcodec rawvideo -pix_fmt rgb24 /dev/video0