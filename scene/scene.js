// =============================================================================
//
// Scene
//
// =============================================================================
class Scene {
    #camera
    #objects

    constructor(args = {}) {
        this.#camera = new Camera();
        this.#objects = args;
    }

    setProperty(key, value) {
        this.#objects[key] = value;
    }

    getProperty(key) {
        return this.#objects[key];
    }
};