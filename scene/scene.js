// =============================================================================
//
// Scene
//
// =============================================================================
class Scene {
    #objects
    constructor(args = {}) {
        this.#objects = args;
    }

    setProperty(key, value) {
        this.#objects[key] = value;
    }

    getProperty(key) {
        return this.#objects[key];
    }
};