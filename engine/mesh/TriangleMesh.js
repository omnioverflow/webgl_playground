
/**
 * A wrapper representing a triangular mesh.
 * 
 * TODO: what is important is to make sure that a TriangleMesh object does not
 * create a copy of vertexPositions and triangles,
 * but simply reference the input objects in ctor.
 */
class TriangleMesh {
    //--------------------------------------------------------------------------
    #vertexPositions
    #triangles
    //--------------------------------------------------------------------------

    constructor(vertexPositions, triangles) {
        // FIXME: does it make a copy or just a reference to the input objects?
        this.#vertexPositions = vertexPositions;
        this.#triangles = triangles;
    }

    //--------------------------------------------------------------------------
} // class TriangleMesh