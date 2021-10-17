// =============================================================================
//
// WebGLController
//
// =============================================================================

// Could not manage to keep scale a private attrib inside WebGLcontroller
// since we had register wheel event listener to the canvas, and canvas could
// not access and change the scale property from WebGLController.
var scale = 2.0;

class WebGLController {
    #canvas
    #gl
    #program
    #vao

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

    registerListeners() {
        // register mouse event listeners for the canvas
        this.#canvas.addEventListener("mousedown", e => {
            this.#fromPos[0] = event.pageX;
            this.#fromPos[1] = event.pageY; 
        });
        
        this.#canvas.addEventListener("mouseup", e => {
            const slowDownCoefficient = 0.5 * scale;
            this.#toPos[0] = event.pageX;
            this.#toPos[1] = event.pageY;

            const deltaX = slowDownCoefficient * (this.#toPos[0] - this.#fromPos[0])
                / this.#canvas.width;            
            const deltaY = slowDownCoefficient * (this.#toPos[1] - this.#fromPos[1])
                / this.#canvas.height;

            this.#translation[0] = this.#translation[0] - deltaX;
            this.#translation[1] = this.#translation[1] + deltaY;
            this.initTranslation(this.#translation);
        });
        this.#canvas.addEventListener("wheel", e => {
            // FIXME: get rid of magic numbers here.
            const minScale = 0.2;
            const maxScale = 3.0;
            const scaleChange = 1.05;

            if (event.deltaY > 0)
            {
                console.log("scrolling down!");
                scale /= scaleChange;
            }
            else if (event.deltaY < 0)
            {
                console.log("scrolling up!");
                scale *= scaleChange;
            }

            if (scale < minScale)
                scale = minScale;
            else if (scale > maxScale)
                scale = maxScale;

            {
                const location = this.#gl.getUniformLocation(this.#program, "uScale");
                this.#gl.uniform1f(location, scale);
            }

            // re-render
            this.render(); 
        });
    } // registerListeners

    init() {
        this.#canvas = document.getElementById("gl-canvas");

        // Configure WebGL
        this.initGL();

        // View-related stuff
        // TODO: needs refactoring
        this.#translation = new Float32Array([-1.5, -1.0]);
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
            this.#gl.uniform1f(location, scale);
        }

        this.initTranslation(this.#translation);

        {
            const res = [this.#canvas.width, this.#canvas.height];
            const location = this.#gl.getUniformLocation(this.#program, "uScreenRes");
            this.#gl.uniform2fv(location, res);
        }

        this.#gl.bindVertexArray(null);
    } // initBuffers    
} // class WebGLController

// =============================================================================
//
// Init and run WebGL program
//
// =============================================================================

var controller = new WebGLController();
window.onload = controller.init();
