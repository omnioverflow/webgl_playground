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

    const x0 = Math.random();
    const y0 = Math.random();
    const vertexData = new Float32Array([
        x0, y0, 0, 1, 1, -1, // positions
        0.0, 0.0, 0.1, 0.0, 1.0, 0.2, 0.0, 0.5, 0.5 // colors
        ]);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders
    program = initShaders(gl, "vertex-shader", "fragment-shader");    

    // Load the data into the GPU, configure buffers and attributes
    const bufferId = gl.createBuffer();
    // Need WebGL2 context for that
    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

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
        gl.enableVertexAttribArray(0);
    }

    {
        const pos = gl.getAttribLocation(program, "iColor");
        const size = 3;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const sizeOfType = 4; // sizeof float in webgl
        const offset = 6 * sizeOfType;
        gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
        gl.enableVertexAttribArray(1);
    }

    gl.bindVertexArray(null);

    render();
};

function render()
{
    gl.useProgram(program);
    gl.bindVertexArray(vao);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}