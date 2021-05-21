var gl;
var points;

// look at:
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample6/webgl-demo.js

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    var program = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(program);

    initBuffers(gl, program);
    const texture = loadTexture(gl, 'block.jpg');

    drawScene();
};

function initBuffers(gl, program)
{
    var vertices = new Float32Array([-1, -1, 0, 1, 1, -1]);
    // Load the data into the GPU
    var bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);
}

function drawScene()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}