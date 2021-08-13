// TODO: provide impl

class RenderableTriangleMesh {
    //--------------------------------------------------------------------------
    #triangleMesh
    //--------------------------------------------------------------------------
    constructor(triangleMesh, lazyLoad = false) {
        this.#triangleMesh = triangleMesh;

        if (!lazyLoad) {
            this.bindBuffers();
        }
    }

    //--------------------------------------------------------------------------
    
    bindBuffers() {
        // TODO: impl
    }

    //--------------------------------------------------------------------------
    get triangleMesh() {
        return this.#triangleMesh;
    }
    //--------------------------------------------------------------------------
} // class RenderableTriangleMesh
