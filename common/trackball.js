class VirtualTrackball {
    screenWidth = -1;
    screenHeight = -1;

    constructor(screenWidth, screenHeight) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        
        this.prevPos = vec2.create(new Float32Array([NaN, NaN]));
        this.currPos = vec2.create(new Float32Array([NaN, NaN]));
    }

    onMouseDown(pos) {
        // FIXME: missing impl
    }

    onMouseUp(pos) {
        // FIXME: missing impl
    }
} // class Trackball