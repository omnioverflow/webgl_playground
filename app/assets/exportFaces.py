import re
import sys

def exportFaces(fileName):
    faces = []
    with open(fileName) as f:        
        for line in f:
            line = re.split(' |\n', line)
            if line[0] == 'f':
                line = line[1:4]
                faces.append(line)
    print(faces)

if __name__ == "__main__":
    exportFaces(sys.argv[1])