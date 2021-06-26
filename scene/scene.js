// =============================================================================
//
// Scene
//
// =============================================================================
class Scene {
    camera
    #objects

    constructor(camera, args = {}) {
        this.camera = camera;
        this.#objects = args;
    }

    setProperty(key, value) {
        this.#objects[key] = value;
    }

    getProperty(key) {
        return this.#objects[key];
    }
};