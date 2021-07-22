README

exportVertices.py and exportFaces.py helper scripts could be used to 
read Wavefront obj files in a naive way, and export vertices a faces to
a separate where, where they could be exported for the use in js code.

py exportVertices.py <OBJ_FILE_NAME> > teapot.js
py exportFaces.py <OBJ_FILE_NAME> >> teapot.js

Example:
py exportVertices.py teapot.obj > teapot.js
py exportFaces.py teapot.obj >> teapot.js