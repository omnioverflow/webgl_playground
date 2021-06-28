// =============================================================================
//
// Scene
//
// =============================================================================
class Scene {
    camera
    #objects
    #cubeModelMatrix
    #enableCubeRotation

    constructor(camera, args = {}) {
        this.camera = camera;
        this.#objects = args;
        this.#cubeModelMatrix = mat4.identity();
        this.#enableCubeRotation = false;
    } // ctor

    get cubeModelMatrix() {
        return this.#cubeModelMatrix;
    } // get cubeModelMatrix

    toggleCubeRotation() {
        this.#enableCubeRotation = !this.#enableCubeRotation;
    } // toggleCubeRotation

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