var gl;
var points;

window.onload = function init()
{
    const canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }

    const vertexData = new Float32Array([-1, -1, 0, 1, 1, -1]);
    const colors = new Float32Array([1.0, 0.0, 0.0, 1.0, 1.0, 1.0]);

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);

    // Load shaders and initialize attribute buffers
    const program = initShaders(gl, "vertex-shader", "fragment-shader")
    gl.useProgram(program);

    // Load the data into the GPU
    const bufferId = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
    gl.bufferData(gl.ARRAY_BUFFER, vertexData, gl.STATIC_DRAW);

    // Associate out shader variables with our data buffer
    const iPosition = gl.getAttribLocation(program, "iPosition");
    gl.vertexAttribPointer(iPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(iPosition);

    const iColor = gl.getAttribLocation(program, "iColor");
    gl.vertexAttribPointer(iColor, 2 /* size */, gl.FLOAT /* type */, 
        false /*normalized*/, 0 /* stride */, 0 /* pointer */);
    gl.enableVertexAttribArray(iColor);

    render();
};

function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
}