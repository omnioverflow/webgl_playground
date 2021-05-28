window.onload = procedural_cube([0.0, 0.0, 0.0], 1.0);

function procedural_cube(center, size) {
    const halfEdge = size / 2;
    const numVertices = 8;
    const numCoordinates = 3 * numVertices; 
    const numFaces = 6;

    let vertices = new Float32Array(3 * numVertices);
    
    let vertIndex = 0;
    for (let i = -1; i <= 1; i +=2)
        for (let j = -1; j <= 1; j += 2)
            for (let k = -1; k <= 1; k += 2) {
                vertices[3 * vertIndex] = i * halfEdge + center[0];
                vertices[3 * vertIndex + 1] = j * halfEdge + center[1];
                vertices[3 * vertIndex + 2] = k * halfEdge + center[2];
                vertIndex++;
            }

    let indices = new Uint16Array([
            // face 0
            0, 2, 1,
            1, 2, 3,
            // face 1
            0, 1, 4,
            1, 5, 4,
            // face 2
            0, 4, 2,
            4, 6, 2,
            // face 3
            3, 1, 5,
            3, 5, 7,
            // face 4
            6, 3, 2,
            6, 7, 3,
            // face 5
            4, 5, 6,
            5, 7, 6
        ]);


    let textureCoords = new Float32Array([
        // face 0
        1.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // face 1
        0.0, 1.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        // face 2
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0,
        0.0, 1.0,
        // face 3
        1.0, 1.0,
        1.0, 0.0,
        0.0, 0.0,
        1.0, 1.0,
        0.0, 0.0, 
        0.0, 1.0,
        // face 4
        1.0, 0.0,
        0.0, 1.0,
        0.0, 0.0,
        1.0, 0.0,
        1.0, 1.0,
        1.0, 0.0,
        // face 5
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 0.0,
        1.0, 1.0, 
        0.0, 1.0
        ]);


    return {
        vertexCoordinates: vertices,
        textureCoordinates: textureCoords,
        faces: indices
    }
}