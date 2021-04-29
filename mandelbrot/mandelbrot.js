var canvas;
var gl;
var points;
var program;
var vao;

window.onload = function init()
{
    canvas = document.getElementById("gl-canvas");
    // Configure WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }

    initBuffers();

    render();
};

function initBuffers()
{
    const vertexData = new Float32Array([
        // positions
        -1.0, -1.0, /* bottom left */ 0.0, 0.0, 0.1,
        -1.0, 1.0, /* top left*/ 0.0, 1.0, 0.2,
         1.0, -1.0, /* bottom right */ 0.0, 0.5, 0.5,
         1.0, 1.0, /* top right */ 0.1, 0.3, 0.0     
        ]);

    const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");    

    // Load the data into the GPU, configure buffers and attributes
    const bufferId = gl.createBuffer();
    // Need WebGL2 context for that
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    // vbo
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    // ebo (element buffer object)
    {
        const indicesBufferId = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBufferId);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
    }
    
    const sizeOfFloat = 4; // sizeof float in webgl
    {
        const pos = gl.getAttribLocation(program, "iPosition");
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 5 * sizeOfFloat; // == 0 -- move forward size * sizeof(type) to get the next position
        const offset = 0; // start at the beginning of the buffer 
        gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(0);
    }

    {
        const pos = gl.getAttribLocation(program, "iColor");
        const size = 3;
        const type = gl.FLOAT;
        const normalize = false;
        
        const stride = 5 * sizeOfFloat;
        const offset = 3 * sizeOfFloat;
        gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(1);
    }

    gl.bindVertexArray(null);
}

function render()
{
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.clear(gl.COLOR_BUFFER_BIT);
    {
        const vertexCount = 6;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }
}