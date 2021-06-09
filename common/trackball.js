class VirtualTrackball {
    constructor() {
        this.canvasWidth = NaN;
        this.canvasHeight = NaN;
        this.prevPos = vec2.create(new Float32Array([NaN, NaN]));
        this.currPos = vec2.create(new Float32Array([NaN, NaN]));
        this.drawVisualEffect = false;
    }

    onMouseDown(pos) {
        // FIXME: missing impl
    }

    onMouseUp(pos) {
        // FIXME: missing impl
    }
} // class Trackball