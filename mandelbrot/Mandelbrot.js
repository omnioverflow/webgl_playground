// =============================================================================
//
// WebGLController
//
// =============================================================================

class WebGLController {
    #canvas
    #gl
    #program
    #vao

    #scale
    #translation
    #fromPos
    #toPos
    #isMouseMoved

    initGL() {
        this.#gl = WebGLUtils.setupWebGL(this.#canvas);
        if (!this.#gl) {
            alert("WebGL isn't available");
        }
    } // initGL

    registerListeners() {
        // register mouse event listeners for the canvas
        this.#canvas.addEventListener("mousedown", e => {
            fromPos[0] = event.pageX;
            fromPos[1] = event.pageY; 
        });
        
        this.#canvas.addEventListener("mouseup", e => {
            toPos[0] = event.pageX;
            toPos[1] = event.pageY;
            const deltaX = (toPos[0] - fromPos[0]) / canvas.width;
            const deltaY = (toPos[1] - fromPos[1]) / canvas.height;
            translation[0] = translation[0] - deltaX;
            translation[1] = translation[1] + deltaY;
            this.initTranslation(this.#translation);
        });
        this.#canvas.addEventListener("wheel", this.onMouseWheel);
    } // registerListeners

    init() {
        this.#canvas = document.getElementById("gl-canvas");

        // Configure WebGL
        this.initGL();

        // View-related stuff
        // TODO: needs refactoring
        this.#scale = 1.0;
        this.#translation = new Float32Array([0.0, 0.0]);
        this.#fromPos = new Float32Array([0.0, 0.0]);
        this.#toPos = new Float32Array([0.0, 0.0]);
        this.#isMouseMoved = false;

        this.registerListeners();

        this.initBuffers();

        this.render();
    }; // init

    initTranslation(t) {
        this.#gl.useProgram(this.#program);
        const location = this.#gl.getUniformLocation(this.#program, "uTranslation");
        this.#gl.uniform2fv(location, t);

        this.render();
    } // initTranslation

    initBuffers() {
        const vertexData = new Float32Array([
            // positions
            -1.0, -1.0, /* bottom left */ 0.0, 0.0, 0.1,
            -1.0, 1.0, /* top left*/ 0.0, 1.0, 0.2,
             1.0, -1.0, /* bottom right */ 0.0, 0.5, 0.5,
             1.0, 1.0, /* top right */ 0.1, 0.3, 0.0     
            ]);

        const indices = new Uint16Array([0, 1, 2, 1, 3, 2]);

        this.#gl.viewport(0, 0, this.#canvas.width, this.#canvas.height);
        this.#gl.clearColor(1.0, 1.0, 1.0, 1.0);

        // Load shaders
        this.#program = initShaders(this.#gl, "vertex-shader", "fragment-shader");    

        // Load the data into the GPU, configure buffers and attributes
        const bufferId = this.#gl.createBuffer();
        // Need WebGL2 context for that
        this.#vao = this.#gl.createVertexArray();
        this.#gl.bindVertexArray(this.#vao);

        // vbo
        this.#gl.bindBuffer(this.#gl.ARRAY_BUFFER, bufferId);
        this.#gl.bufferData(this.#gl.ARRAY_BUFFER, vertexData, this.#gl.STATIC_DRAW);

        // ebo (element buffer object)
        {
            const indicesBufferId = this.#gl.createBuffer();
            this.#gl.bindBuffer(this.#gl.ELEMENT_ARRAY_BUFFER, indicesBufferId);
            this.#gl.bufferData(this.#gl.ELEMENT_ARRAY_BUFFER, indices, this.#gl.STATIC_DRAW);
        }
        
        const sizeOfFloat = 4; // sizeof float in webgl
        {
            const pos = this.#gl.getAttribLocation(this.#program, "iPosition");
            const size = 2;
            const type = this.#gl.FLOAT;
            const normalize = false;
            const stride = 5 * sizeOfFloat; // == 0 -- move forward size * sizeof(type) to get the next position
            const offset = 0; // start at the beginning of the buffer 
            this.#gl.vertexAttribPointer(pos, size, type, normalize, stride, offset);
            this.#gl.enableVertexAttribArray(pos);
        }

        // need to activate the program, before ant gl.uniform...
        this.#gl.useProgram(this.#program);

        {
            const location = this.#gl.getUniformLocation(this.#program, "uScale");
            this.#gl.uniform1f(location, this.#scale);
        }

        this.initTranslation(this.#translation);

        {
            const res = [this.#canvas.width, this.#canvas.height];
            const location = this.#gl.getUniformLocation(this.#program, "uScreenRes");
            this.#gl.uniform2fv(location, res);
        }

        this.#gl.bindVertexArray(null);
    } // initBuffers

    render() {
        this.#gl.useProgram(this.#program);
        this.#gl.bindVertexArray(this.#vao);
        this.#gl.clear(this.#gl.COLOR_BUFFER_BIT);
        {
            const vertexCount = 6;
            const type = this.#gl.UNSIGNED_SHORT;
            const offset = 0;
            this.#gl.drawElements(this.#gl.TRIANGLES, vertexCount, type, offset);
        }
    } // render

    onMouseDown() {
        alert("Mouse down!");
    } // onMouseDown

    onMouseWheel() {
        const scaleChange = 0.2;
        if (event.deltaY > 0)
        {
            console.log("scrolling down!");
            scale -= scaleChange;
        }
        else if (event.deltaY < 0)
        {
            console.log("scrolling up!");
            scale += scaleChange;
        }

        {
            const location = this.#gl.getUniformLocation(this.#program, "uScale");
            this.#gl.uniform1f(location, scale);
        }

        // re-render
        render();
    } // onMouseWheel
} // class WebGLController

// =============================================================================
//
// Init and run WebGL program
//
// =============================================================================

var controller = new WebGLController();
window.onload = controller.init();