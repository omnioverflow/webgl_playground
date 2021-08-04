// =============================================================================
//
// Scene
//
// =============================================================================

// TODO: 
// - Refactor the scene to accomodate for multiple obejcts;
// - Camera object should not be part of the scene.


/* 
    ALREADY DONE:
    - Camera is not part of the scene any more;
    - Accessor/mutator for the renderable objects;
*/

class Scene {
    #objects
    #cubeModelMatrix
    #cubeRotation
    #enableCubeRotation

    constructor(args = {}) {
        this.#objects = args;
        this.#cubeModelMatrix = mat4.identity();
        this.#cubeRotation = 0.0;
        this.#enableCubeRotation = false;
    } // ctor

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


// =============================================================================
// Accessors and Mutators for objects.
// =============================================================================
    setObject(key, object) {
        this.#objects[key] = object;
    } // setObject

    getObject(key) {
        return this.#objects[key];
    } // getObject
};