// look at:
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample6/webgl-demo.js

window.onload = function init()
{
    const canvas = document.getElementById("gl-canvas");
    const gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    const shaderProgram = initShaders(gl, "vertex-shader", "fragment-shader");
    const programInfo = {
        program: shaderProgram,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgram, 'aPosition'),
            textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord')
        },
        uniformLocations: {
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler')
        }
    };

    const buffers = initBuffers(gl, programInfo);
    // FIXME: leave only the url which is in use
    const texUrl = 'https://www.babylonjs-playground.com/textures/bloc.jpg';
    const texUrl2 = 'https://www.babylonjs-playground.com/textures/floor_bump.PNG';
    const texture = loadTexture(gl, texUrl2);

    drawScene(gl, programInfo, buffers);
};

function initBuffers(gl, programInfo)
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
    gl.bufferData(gl.ARRAY_BUFFER, 
                  new Float32Array(vertices),
                  gl.STATIC_DRAW);

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

    gl.bufferData(gl.ARRAY_BUFFER, 
                  new Float32Array(textureCoordinates),
                  gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer
    }
}

function drawScene(gl, programInfo, buffers)
{
    // Clear color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Tell GPU how to pull out vertex coordinates
    // from the data associated to vertex attributes
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(programInfo.attribLocations.vertexPosition, 
                               numComponents, type, normalize,
                               stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
    }

    // Tell GPU how to pull out texture coordinates
    // from the data in the buffer
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);

        const numComponents = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(programInfo.attribLocations.textureCoord, 
                               numComponents, type, normalize,
                               stride, offset);
        gl.enableVertexAttribArray(programInfo.attribLocations.textureCoord);
    }

    gl.useProgram(programInfo.program);
    
    // Execute the actual draw
    {        
        const vertexCount = 3;
        gl.drawArrays(gl.TRIANGLES, 0, vertexCount);
    }
}