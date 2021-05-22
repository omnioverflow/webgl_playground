// look at:
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample6/webgl-demo.js

window.onload = function init()
{
    var canvas = document.getElementById("gl-canvas");
    const gl = WebGLUtils.setupWebGL(canvas);
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

    const buffers = initBuffers(gl, program);
    // FIXME: leave only the url which is in use
    const texUrl = 'https://www.babylonjs-playground.com/textures/bloc.jpg';
    const texUrl2 = 'https://www.babylonjs-playground.com/textures/floor_bump.PNG';
    const texture = loadTexture(gl, texUrl2);

    drawScene(gl);
};

function initBuffers(gl, program)
{
    const vertices = [
        // v0
        -1, -1,
        // v1
         0, 1,
        // v2
         1, -1
        ];
    // Load the vertex position data into the GPU
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Tell GPU how to pull out vertex coordinates
    // from the data associated to vertex attributes
    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Init texture coordinate buffer
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
    textureCoordinates = [
        // v0
        0.0, 0.0,
        // v1
        1.0, 0.0,
        // v2
        1.0, 1.0
    ];

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer
    }
}

function drawScene(gl)
{
    // Clear color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Execute the actual draw
    {
        const vertexCount = 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
}