class Trackball {
    prevPos = vec2(NaN, NaN);
    currPos = vec2(NaN, NaN);
    screenWidth = -1;
    screenHeight = -1;
    objectCenterX vec2(NaN, NaN);

    constructor(screenWidth, screenHeight,
                objectCenter) {
        this.screenWidth = screenWidth;
        this.screenHeight = screenHeight;
        this.objectCenter = objectCenter;
    }

    onMouseDown(event) {
        // FIXME: missing impl
    }

    onMouseUp(event) {
        // FIXME: missing impl
    }
} // class Trackball