window.onload = init();

function init() {
    procedural_cube([0.0, 0.0, 0.0], 1.0);
}

function match_tex_coords(curr_vert,
                          curr_tex_coord,
                          tex_coord_cache,
                          vert_cache) {
    // No vertices with the same coordinates
    if (vert_cache == null || !vert_cache.length)
    // Return itself
        return curr_vert;

    for (let i = 0; i < tex_coord_cache.length; i++) {
        if (curr_tex_coord[0] == tex_coord_cache[i][0]
            && curr_tex_coord[1] == tex_coord_cache[i][1])
            return vert_cache[i];
    }

    return null;
}

function reindex_vertex_indices(vertices, 
                                indices,
                                tex_coordinates) {
    let tex_coord_cache = [];
    let vert_cache = [];

    for (let i = 0; i < indices.length; i++) {
        const curr_vert = indices[i];
        const curr_tex = [tex_coordinates[2 * i], 
                          tex_coordinates[2 * i + 1]];

        // Current vertex has texture coordinates which
        // are different from the texture coordinates 
        // seen so far for the same vertex
        const correspond_vert = 
            match_tex_coords(curr_vert,                                                
                             curr_tex,
                             tex_coord_cache[curr_vert],
                             vert_cache[curr_vert]);
        // Found a corresponding vertex which 
        // differs by having different texture cooridnates
        if (correspond_vert == null) {
            // Compute a new vertex index
            // (vertices hold x, y, z coordinates)
            // therefore we need to divide by 3
            const new_vert = vertices.length / 3;
            // Substitute the current with the
            // new vertex index
            indices[i] = new_vert;

            // Add the new vertex coordinates to the vertices
            // x-coord
            vertices.push(vertices[3 * curr_vert]);
            // y-coord
            vertices.push(vertices[3 * curr_vert + 1]);
            // z-coord
            vertices.push(vertices[3 * curr_vert + 2]);

            // Append the new vertex index to the list 
            // of the vertices that shared the same 
            // geometric position (i.e. coordinates)
            let vert_shared = vert_cache[curr_vert];
            if (vert_shared == null)
                vert_shared = [new_vert];
            else
                vert_shared.push(new_vert);

            vert_cache[curr_vert] = vert_shared;

            let tex_shared = tex_coord_cache[curr_vert];
            tex_shared.push(curr_tex);
            // tex_coord_cache[curr_vert] = tex_shared; 
        } else {
            vert_cache[curr_vert] = [curr_vert];
            tex_coord_cache[curr_vert] = [curr_tex];
        }
    }

    return {
        "vertices": vertices,
        "indices": indices
    }
}

function procedural_cube(center, size) {
    const halfEdge = size / 2;
    const numVertices = 8;
    const numCoordinates = 3 * numVertices; 
    const numFaces = 6;

    let vertices = [];
    
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

    const reindexed = reindex_vertex_indices(vertices,
                                             indices,
                                             textureCoords);

    return {
        vertexCoordinates: new Float32Array(reindexed["vertices"]),
        textureCoordinates: textureCoords,
        faces: reindexed["indices"]
    }
}