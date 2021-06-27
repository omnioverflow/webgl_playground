// =============================================================================
//
// Scene
//
// =============================================================================
class Scene {
    camera
    #objects
    #cubeModelMatrix

    constructor(camera, args = {}) {
        this.camera = camera;
        this.#objects = args;
        this.#cubeModelMatrix = mat4.identity();
    } // ctor

    get cubeModelMatrix() {
        return this.#cubeModelMatrix;
    } // get cubeModelMatrix

    uniformScaleCube(uniformScale) {
        this.#cubeModelMatrix[0] = uniformScale;
        this.#cubeModelMatrix[5] = uniformScale;
        this.#cubeModelMatrix[10] = uniformScale;
    } // uniformScaleCube

    setProperty(key, value) {
        this.#objects[key] = value;
    } // setProperty

    getProperty(key) {
        return this.#objects[key];
    } // getProperty
};