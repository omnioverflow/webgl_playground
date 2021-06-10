const VirtualTrackballImpl = {
    resetTimeMillis: 1500
}

class VirtualTrackball {
    #canvasHeight
    #canvasWidth
    #drawEffectFlag

    constructor() {
        this.#canvasWidth = NaN;
        this.#canvasHeight = NaN;
        this.prevMousePos = vec2.create(new Float32Array([NaN, NaN]));
        this.currMousePos = vec2.create(new Float32Array([NaN, NaN]));
        this.#drawEffectFlag = false;
        this.timestamp = NaN;
    } // ctor

    set canvasWidth(value) {
        if (value <= 0)
            throw 'Invalid canvasWidth';

        this.#canvasWidth = value;
    } // setter canvasWidth

    set canvasHeight(value) {
        if (value <= 0.0)
            throw 'Invalid canvasHeight';

        this.#canvasHeight = value;
    } // setter canvasHeight

    get drawEffectFlag() {
        if (isNaN(this.timestamp))
            return false;

        const currTimeMillis = Date.now();
        const elapsedTime = currTimeMillis - this.timestamp;
        if (elapsedTime > VirtualTrackballImpl.resetTimeMillis) {
            this.#drawEffectFlag = false;
            this.timestamp = NaN;
        }
        
        return this.#drawEffectFlag;
    } // drawEffectFlag

    convertToNDC(vector) {
        // Translate to NDC origin
        const halfWidth = this.#canvasWidth / 2;
        const halfHeight = this.#canvasHeight / 2;

        // 1. Convert vector to fit range [0, 2] x [0, 2]
        vector[0] /= halfWidth;
        vector[1] /= halfHeight;
        // 2. Translate origin from top-left to NDC center
        //    and flip the y-axis
        // such that x' = x - 1; and y' = 1 - y; 
        vector[0] = vector[0] - 1;
        vector[1] = 1 - vector[1];      

        return vector;
    } // convertToNDC

    onMouseDown(pos) {
        this.prevMousePos = this.convertToNDC(pos);
        this.#drawEffectFlag = false;
    } // onMouseDown

    onMouseUp(pos) {
        this.currMousePos = this.convertToNDC(pos);
        this.#drawEffectFlag = true;
        this.timestamp = Date.now();
    } // onMouseUp
} // class Trackball