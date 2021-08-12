import re
import sys

def exportVertices(fileName):
    vertices = []
    with open(fileName) as f:        
        for line in f:
            line = re.split(' |\n', line)
            if line[0] == 'v':
                line = line[1:4]
                vertices.append(line)
    print(vertices)

if __name__ == "__main__":
    exportVertices(sys.argv[1])