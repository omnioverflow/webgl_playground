// =============================================================================
//
// Camera
//
// =============================================================================
class Camera {
    #position
    #rotationCenter
    #viewMatrix

    constructor() {
        this.#position = vec3.create(new Float32Array([0.0, 0.0, 0.0]));
        this.#rotationCenter = vec3.create(new Float32Array([0.0, 0.0, 0.0]));
        this.#viewMatrix = mat4.identity();
    } // ctor
};