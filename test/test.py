import sys, json

# simple binary echo script
#sys.stdout.write(sys.stdin.read())

# simple JSON echo script
#for line in sys.stdin:
#  print line[:-1]
sys.stdout.write("from sys\n")

print("This is great")
print("This is great")
# simple argument echo script
for v in sys.argv[1:]:
  print("args")
print("Siddharth\n")

sys.stdout.write("some junk\n")