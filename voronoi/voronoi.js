var gl;
var points;
var program;
var vao;

window.onload = function init()
{
    const canvas = document.getElementById("gl-canvas");
    // Configure WebGL
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }

    const vertexData = new Float32Array([-1, -1, 0, 1, 1, -1]);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");    

    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);
    
    {
        const pos = gl.getAttribLocation(program, "iPosition");
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0; // == 0 -- move forward size * sizeof(type) to get the next position
        const offset = 0; // start at the beginning of the buffer 
        gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(pos);
    }

    {
        const pos = gl.getAttribLocation(program, "iColor");
        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(pos);
    }

    render();
};

function render()
{
    gl.useProgram(program);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}