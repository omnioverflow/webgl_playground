// =============================================================================
//
// Camera
//
// =============================================================================
class Camera {
    #position
    #looksAt
    #rotationCenter
    #viewMatrix

    constructor() {
        this.#position = vec3.create(new Float32Array([0.0, 0.0, 0.0]));
        this.#looksAt = vec3.create(new Float32Array([0.0, 0.0, 0.0]));
        this.#rotationCenter = vec3.create(new Float32Array([0.0, 0.0, 0.0]));
        this.#viewMatrix = mat4.identity();
    } // ctor

    get position() {
        return this.#position;
    } // get position

    get looksAt() {
        return this.#looksAt;
    } // get looksAt

    get viewMatrix() {
        return this.#viewMatrix;
    } // get viewMatrix

    lookAt(to) {
        this.#looksAt = to;
        lookAt(to, this.#position);
    } // lookAt

    lookAt(to, translation) {
        // When computing a view matrix of the camera, we
        // use the following notation for the axes 
        // defining the camera position in space:
        // right (for x-axis), up (for the y-axis),
        // forward (for z-axis).
        // Given the right, up, and forward unit vectors,
        // the view matrix will be composed as:
        //  [right_x, up_x, forward_x, T_x],
        //  [right_y, up_y, forward_y, T_y],
        //  [right_z, up_z, forward_z, T_z],
        //  [0,       0,    0,         1],
        // where T is the camera translation.

        // 1. Compute the forward axis (y-axis).
        const forward = vec3.normalize(vec3.subtract(to - position));

        {
            // FIXME: handle the edge case when forward is aligned with the y-axis
            // of the world coordinate system
            const yAxis = vec3.create([0.0, 1.0, 0.0]);
            const yAxisNeg = vec3.create([0.0, -1.0, 0.0]);
            if (forward == yAxis || forward == yAxisNeg) 
                throw "[Camera] Can't compute forward axis";
        }

        // 2. Compute the right axis (x-axis)
        const tmpVector = vec3.create([0.0, 1.0, 0.0]);
        // Intentionally keep the normalization
        const right = vec3.cross(vec3.normalize(tmpVector), forward);

        // 3. Compute the up vector
        const up = vec3.cross(forward, right);

        // 4. Finally, construct the view matrix for the camera
        let viewMat = mat4.create();
        viweMat[0] = right[0];
        viewMat[1] = up[0];
        viewMat[2] = forward[0];
        viewMat[3] = translation[0];
        viewMat[4] = right[1];
        viewMat[5] = up[1];
        viewMat[6] = forward[1];
        viewMat[7] = translation[1];
        viewMat[8] = right[2];
        viewMat[9] = up[2];
        viewMat[10] = forward[2];
        viewMat[11] = translation[2];
        viewMat[12] = 0.0;
        viewMat[13] = 0.0;
        viewMat[14] = 0.0;
        viewMat[15] = 1.0;

        this.#viewMatrix = viewMat;
    } // lookAt

    moveTo(position) {
        this.#position = position;

        this.#viewMatrix[3] = -position[0];
        this.#viewMatrix[7] = -position[1];
        this.#viewMatrix[11] = -position[2];
    } // moveTo
};