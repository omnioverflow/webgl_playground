// =============================================================================
//
// Scene
//
// =============================================================================

// TODO: 
// - Refactor the scene to accomodate for multiple obejcts;
// - Camera object should not be part of the scene.

class Scene2 {
    // -------------------------------------------------------------------------
    #objects
    // -------------------------------------------------------------------------

    constructor(args = {}) {
        this.#objects = args;
    } // ctor

    // -------------------------------------------------------------------------
    getObject(key) { return this.#objects[key]; }
    setObject(key, object) { this.#objects[key] = object; }
    // -------------------------------------------------------------------------

    /*
    get cubeModelMatrix() {
        return this.#cubeModelMatrix;
    } // get cubeModelMatrix

    toggleCubeRotation() {
        this.#enableCubeRotation = !this.#enableCubeRotation;
    } // toggleCubeRotation

    update(deltaTime) {
        if (this.#enableCubeRotation) {
            this.#cubeRotation += deltaTime;

        // this.#cubeModelMatrix = mat4.translate(this.#cubeModelMatrix, 
        //                [-0.0, 0.0, -7.0]);
        
        const speedCoefficient = 0.001;
        const rotZ = speedCoefficient * this.#cubeRotation; // radians
        mat4.rotate(this.#cubeModelMatrix,
                    rotZ,
                    [0, 0, 1],
                    this.#cubeModelMatrix);
        
        const rotX = speedCoefficient * this.#cubeRotation; // radians
        mat4.rotate(this.#cubeModelMatrix,
                    rotX,
                    [1, 0, 0],
                    this.#cubeModelMatrix);
        }
    } // update

    uniformScaleCube(uniformScale) {
        this.#cubeModelMatrix[0] = uniformScale;
        this.#cubeModelMatrix[5] = uniformScale;
        this.#cubeModelMatrix[10] = uniformScale;
    } // uniformScaleCube

    upscaleCubeUniformlyBy(uniformScale) {
        let scale = mat4.identity();
        scale[0] = uniformScale;
        scale[5] = uniformScale;
        scale[10] = uniformScale;

        this.#cubeModelMatrix = mat4.multiply(scale, this.#cubeModelMatrix,
            this.#cubeModelMatrix);
    } // updateUniformScaleCubeBy
    */
}; // Scene2