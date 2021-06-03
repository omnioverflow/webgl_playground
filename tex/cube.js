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
    const shaderProgramCube = initShaders(gl, "vertex-shader", "fragment-shader");
    const programInfoCube = {
        program: shaderProgramCube,
        attribLocations: {
            vertexPosition: gl.getAttribLocation(shaderProgramCube, 'aPosition'),
            textureCoord: gl.getAttribLocation(shaderProgramCube, 'aTextureCoord')
        },
        uniformLocations: {
            uSampler: gl.getUniformLocation(shaderProgramCube, 'uSampler'),
            modelViewMatrix: gl.getUniformLocation(shaderProgramCube, 'uModelViewMatrix'),
            projectionMatrix: gl.getUniformLocation(shaderProgramCube, 'uProjectionMatrix')
        }
    };

    const buffersCube = initBuffers(gl, programInfoCube);    

    const model_view = {
        cube_rotation : 0.0
    };

    const buffers = { "cube": buffersCube };
    const shaders = { "cube": programInfoCube };
    let renderData = {
        "buffers": buffers,
        "shaders": shaders
    }

    let then = 0;
    function render(now) {
        // convert millis to seconds
        now *= 0.001;
        // FIXME: delta_time = now - then;
        const delta_time = 0.005;
        then = now;

        drawScene(gl, renderData, model_view, delta_time);

        requestAnimationFrame(render);
    }

    const textureUrlCube = 'https://www.babylonjs-playground.com/textures/bloc.jpg';
    const textureCube = loadTexture(gl, textureUrlCube, render,
                                    programInfoCube, buffersCube, model_view);

    const textures = { "cube" : textureCube };
    renderData["textures"] = textures;
    
    requestAnimationFrame(render);
};

function update(model_view, delta_time) {
    model_view.cube_rotation += delta_time;
}

function initBuffers(gl, programInfo)
{
    const cube = new ProceduralCube([0.0, 0.0, 0.0], 1.0);
    // cube.vertexCoordinates = new Float32Array([
    //     // Front face
    //     -1.0, -1.0,  1.0,
    //     1.0, -1.0,  1.0,
    //     1.0,  1.0,  1.0,
    //     -1.0,  1.0,  1.0,

    //     // Back face
    //     -1.0, -1.0, -1.0,
    //     -1.0,  1.0, -1.0,
    //     1.0,  1.0, -1.0,
    //     1.0, -1.0, -1.0,

    //     // Top face
    //     -1.0,  1.0, -1.0,
    //     -1.0,  1.0,  1.0,
    //     1.0,  1.0,  1.0,
    //     1.0,  1.0, -1.0,

    //     // Bottom face
    //     -1.0, -1.0, -1.0,
    //     1.0, -1.0, -1.0,
    //     1.0, -1.0,  1.0,
    //     -1.0, -1.0,  1.0,

    //     // Right face
    //     1.0, -1.0, -1.0,
    //     1.0,  1.0, -1.0,
    //     1.0,  1.0,  1.0,
    //     1.0, -1.0,  1.0,

    //     // Left face
    //     -1.0, -1.0, -1.0,
    //     -1.0, -1.0,  1.0,
    //     -1.0,  1.0,  1.0,
    //     -1.0,  1.0, -1.0,
    // ]);

    // cube.textureCoordinates = new Float32Array([
    //      // Front
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    //     // Back
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    //     // Top
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    //     // Bottom
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    //     // Right
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    //     // Left
    //     0.0,  0.0,
    //     1.0,  0.0,
    //     1.0,  1.0,
    //     0.0,  1.0,
    // ]);

    // cube.faces = new Int16Array([
    //     0,  1,  2,      0,  2,  3,    // front
    //     4,  5,  6,      4,  6,  7,    // back
    //     8,  9,  10,     8,  10, 11,   // top
    //     12, 13, 14,     12, 14, 15,   // bottom
    //     16, 17, 18,     16, 18, 19,   // right
    //     20, 21, 22,     20, 22, 23,   // left
    // ]);

    // const nbVert = cube.vertexCoordinates.length / 3;
    // for (let i = 0; i < nbVert; ++i)
    //     cube.vertexCoordinates[i * 3 + 2] = +2.0;

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
}