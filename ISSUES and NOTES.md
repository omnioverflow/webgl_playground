On Webgl 1 vs WebGL 2

Short diff:
in --> attribute
out --> varying
(attribute can be used in vertex shader only)

Long diff (from https://stackoverflow.com/questions/9415928/):
The in and out keywords as you show them are for GLSL v3 and later. 
For v1 (which is what you're trying to use?) you need to replace in 
with attribute and out with varying in the vertex shader. 
In the fragment shader, replace in with varying and you can't use out
 -- you need to output to gl_FragColor as you seem to be doing.