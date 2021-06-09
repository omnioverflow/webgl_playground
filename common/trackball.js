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
        vector[0] -= this.#canvasWidth / 2;
        vector[1] -= this.#canvasHeight / 2;
        vector[0] /= this.#canvasWidth;
        vector[1] /= this.#canvasHeight;
        return vector;
    } // convertToNDC

    onMouseDown(pos) {

        this.prevMousePos = this.convertToNDC(pos);
    } // onMouseDown

    onMouseUp(pos) {
        this.currMousePos = this.convertToNDC(pos);
        this.#drawEffectFlag = true;
        this.timestamp = Date.now();
    } // onMouseUp
} // class Trackball