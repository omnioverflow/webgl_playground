import re
import sys

def exportFaces(fileName):
    faces = []
    with open(fileName) as f:        
        for line in f:
            # As in case of exporting vertices, substitute multiple spaces
            # with a single space and remove leading and trailing spaces.
            # (poor solution since we do two consecutive splits).
            line = ' '.join(line.split())
            line = re.split(' |\n', line)
            if line[0] == 'f':
                line = line[1:4]
                faces.append(line)
    print(faces)

if __name__ == "__main__":
    exportFaces(sys.argv[1])