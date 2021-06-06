// look at:
// https://github.com/mdn/webgl-examples/blob/gh-pages/tutorial/sample6/webgl-demo.js

window.onload = function init()
{
    const gl = setupWebGL();

    const modelView = { cube_rotation : 0.0 };
    // "Forward declare" render function
    let then = 0;
    function render(now) {
        // convert millis to seconds
        now *= 0.001;
        // FIXME: delta_time = now - then;
        const delta_time = 0.005;
        then = now;

        drawScene(gl, renderData, modelView, delta_time);

        requestAnimationFrame(render);
    }

    // Compile shaders and set up buffers
    // For the fullscreen overlay and cube object
    const overlayData = setupOverlay(gl);
    const cubeData = setupCube(gl, render);

    const buffers = { "overlay" : overlayData.buffers,
                      "cube": cubeData.buffers };
    const shaders = { "overlay" : overlayData.programInfo,
                      "cube" : cubeData.programInfo };
    const textures = { "overlay" : overlayData.texture,
                       "cube" : cubeData.texture }
    let renderData = {
        "buffers": buffers,
        "shaders": shaders,
        "textures": textures
    }
    
    requestAnimationFrame(render);
};

function setupWebGL() {
    const canvas = document.getElementById("gl-canvas");
    const gl = WebGLUtils.setupWebGL(canvas);
    if (!gl) 
    {
        alert("WebGL isn't available");
    }
    return gl;
}

function setupOverlay(gl) {
    // FIXME: provide impl
    return { "buffers" : [], "programInfo" : {}, "texture" : 0}
} // setupOverlay

function setupCube(gl, render, modelView) {
    // FIXME: provide impl
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

    const buffers = initCubeBuffers(gl, shaderProgram);

    const textureUrl = 'https://www.babylonjs-playground.com/textures/bloc.jpg';
    const texture = loadTexture(gl, textureUrl, render,
                                    shaderProgram, buffers, modelView);

    return { 
        "buffers" : buffers,
        "programInfo" : programInfo,
        "texture" : texture
        };
} // setupCode

function update(model_view, delta_time) {
    model_view.cube_rotation += delta_time;
}

function initOverlayBuffers(gl, programInfo)
{
    const overlay = new ProceduralQuad();
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, overlay.vertexCoordinates, gl.STATIC_DRAW);

    const indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, overlay.faces. gl.STATIC_DRAW);

    return {
        position : positionBuffer,
        indices : indexBufer,
        vertexCount : overlay.vertexCoordinates.length / 3
    }
}

function initCubeBuffers(gl, programInfo)
{
    const cube = new ProceduralCube([0.0, 0.0, 0.0], 1.0);

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
} // initCubeBuffers

function drawScene(gl, renderData, model_view, delta_time)
{
    gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

    // Clear color and depth buffers
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    { // render cube scope
        const programInfo = renderData.shaders.cube;
        const buffers = renderData.buffers.cube;
        const texture = renderData.textures.cube;

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        // vertical field-of-view
        const fovy = 60 * Math.PI / 180;   // in radians
        const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        const z_near = 0.01;
        const z_far = 100.0;

        // let projection_mat = mat4.perspective(fovy, aspect, z_near, z_far);
        let projection_mat = new Float32Array(
            [1.8106601238250732, 0, 0, 0, 0, 2.4142136573791504, 
            0, 0, 0, 0, -1.0020020008087158,
             -1, 0, 0, -0.20020020008087158, 0]
            );
        // let projection_mat = mat4.identity();
        let modelview_mat = mat4.identity();

        {
            modelview_mat = mat4.translate(modelview_mat, 
                           [-0.0, 0.0, -7.0]);
            
            const rot_z_radian = model_view.cube_rotation;
            mat4.rotate(modelview_mat,
                        rot_z_radian,
                        [0, 0, 1],
                        modelview_mat);
            
            const rot_x_radian = .7 * model_view.cube_rotation;
            mat4.rotate(modelview_mat,
                        rot_x_radian,
                        [1, 0, 0],
                        modelview_mat);
        }

        gl.useProgram(programInfo.program);

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
    } // render cube

    // update rendering state
    update(model_view, delta_time);
} // drawScene