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
        this.#position = vec3([0.0, 0.0, 0.0]);
        this.#rotationCenter = vec3([0.0, 0.0, 0.0]);
        this.#viewMatrix = mat4.identity();
    }
};