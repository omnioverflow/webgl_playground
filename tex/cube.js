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
            uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
            modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix')
        }
    };

    const buffers = initBuffers(gl, programInfo);    

    const model_view = {
        cube_rotation : 0.0
    };

    let then = 0;
    function render(now) {
        // convert millis to seconds
        now *= 0.001;
        const delta_time = now - then;
        then = now;

        drawScene(gl, programInfo, buffers, 
            texture, model_view, delta_time);

        requestAnimationFrame(render);
    }

    const texUrl = 'https://www.babylonjs-playground.com/textures/bloc.jpg';
    const texture = loadTexture(gl, texUrl, render, programInfo,
                                buffers, model_view);
    
    requestAnimationFrame(render);
};

function update(model_view, delta_time) {
    model_view.cube_rotation += delta_time;
}

function initBuffers(gl, programInfo)
{
    const cube = procedural_cube([0.0, 0.0, 0.0], 1.0);

    // Load the vertex position data into the GPU
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, 
                  cube.vertexCoordinates,
                  gl.STATIC_DRAW);

    // Init texture coordinate buffer
    const textureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, 
                  cube.textureCoordinates,
                  gl.STATIC_DRAW);

    // Set up an element array buffer to hold indices into
    // vertex array that form triangles
    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

    // send the element array to the GPU
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, 
                  cube.faces,
                  gl.STATIC_DRAW);

    return {
        position: positionBuffer,
        textureCoord: textureCoordBuffer,
        indices: indexBuffer,
        // vertexCoordinates consist of 3d points, so divide by 3
        vertexCount: cube.vertexCoordinates.length / 3
    }
}

function drawScene(gl, programInfo, buffers,
                   texture, model_view, delta_time)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    {
        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        // vertical field-of-view
        const fovy = 45 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const z_near = 0.1;
        const z_far = 100.0;

        const projection_mat = mat4.perspective(fovy, aspect,
                                                z_near, z_far);

        // Create a model-view matrix
        let modelview_mat = mat4.create();
        mat4.translate(modelview_mat, 
                       [-0.0, 0.0, -6.0],
                       modelview_mat);
        // Specify rotation around z-axis
        const rot_z_radian = model_view.cube_rotation;
        mat4.rotate(modelview_mat,
                    rot_z_radian,
                    [0, 0, 1],
                    modelview_mat);
        // Rotation around x-axis
        const rot_x_radian = .7 * model_view.cube_rotation;
        mat4.rotate(modelview_mat,
                    rot_x_radian,
                    [1, 0, 0],
                    modelview_mat);
                    
        gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projection_mat);

        gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelview_mat);

        model_view.cube_rotation += delta_time;
    }

    // Tell GPU how to pull out vertex coordinates
    // from the data associated to vertex attributes
    {
        gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

        const numComponents = 3;
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

    // Bind element array buffer
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

    // Specify texture to WebGL
    // Use texture unit 0
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    // Associate shader sampler to texture unit 0
    gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

    // Configure matrix uniforms
    gl.uniformMatrix4fv(
            programInfo.uniformLocations.projectionMatrix,
            false,
            projection_mat);

    gl.uniformMatrix4fv(
            programInfo.uniformLocations.modelViewMatrix,
            false,
            modelview_mat);

    // Execute the actual draw
    {        
        const vertexCount = buffers.vertexCount;
        const type = gl.UNSIGNED_SHORT;
        const offset = 0;
        gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
    }

    // update rendering state
    update(model_view, delta_time);
}