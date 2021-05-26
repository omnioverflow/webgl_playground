window.onload = cube([0.0, 0.0, 0.0], 1.0);

function cube(center, size) {
    const halfEdge = size / 2;
    let vertices = new Float32Array(24);
    
    let vertIndex = 0;
    for (let i = -1; i <= 1; i +=2)
        for (let j = -1; j <= 1; j += 2)
            for (let k = -1; k <= 1; k += 2) {
                vertices[3 * vertIndex] = i * halfEdge + center[0];
                vertices[3 * vertIndex + 1] = j * halfEdge + center[1];
                vertices[3 * vertIndex + 2] = k * halfEdge + center[2];
                vertIndex++;
            }
}