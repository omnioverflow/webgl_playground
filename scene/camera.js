// =============================================================================
//
// Camera
//
// =============================================================================

// FIXME: resolve all fixmes

class Camera {
    #position
    #target
    #pivot
    #projectionMatrix
    #viewMatrix

    constructor(position, target, pivot, up) {
        this.#position = position;
        this.#target = target;
        // FIXME: rotate camera around its pivot
        this.#pivot = pivot;

        // TODO: make projection matrix flexible

        // Create a perspective matrix, a special matrix that is
        // used to simulate the distortion of perspective in a camera.
        // Our field of view is 45 degrees, with a width/height
        // ratio that matches the display size of the canvas
        // and we only want to see objects between 0.1 units
        // and 100 units away from the camera.

        // vertical field-of-view
        // const fovy = 60 * Math.PI / 180;   // in radians
        // const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        // const z_near = 0.01;
        // const z_far = 100.0;

        // this.#projectionMatrix = mat4.perspective(fovy, aspect, z_near, z_far);
        this.#projectionMatrix = new Float32Array(
            [1.8106601238250732, 0, 0, 0,
             0, 2.4142136573791504, 0, 0,
             0, 0, -1.0020020008087158, -1,
             0, 0, -0.20020020008087158, 0
            ]);
        // this.#projectionMatrix = mat4.identity();

        this.lookAtNaive(position, target, up);
    } // ctor

    get position() {
        return this.#position;
    } // get position

    get target() {
        return this.#target;
    } // get target

    get viewMatrix() {
        return this.#viewMatrix;
    } // get viewMatrix

    setViewMatrix(value) {
        this.#viewMatrix = value;
    } // set viewMatrix

    get projectionMatrix() {
        return this.#projectionMatrix;
    } // get projectionMatrix

    lookAt(to) {
        this.#target = to;
        lookAt(to, this.#position);
    } // lookAt


    // Unoptimized implementation of camera "lookAt" method
    lookAtNaive(eye, target, up) {
        this.#position = eye;
        this.#target = target;

        let zAxis = vec3.create();
        zAxis = vec3.normalize(vec3.subtract(eye, target, zAxis));
        let xAxis = vec3.create();
        xAxis = vec3.normalize(vec3.cross(up, zAxis, xAxis));
        let yAxis = vec3.create();
        yAxis = vec3.cross(zAxis, xAxis, yAxis);

        let orientation = mat4.create();
        // column 0
        orientation[0] = xAxis[0];
        orientation[1] = xAxis[1];
        orientation[2] = xAxis[2];
        orientation[3] = 0.0;
        // column 1
        orientation[4] = yAxis[0];
        orientation[5] = yAxis[1];
        orientation[6] = yAxis[2];
        orientation[7] = 0.0;
        // column 2
        orientation[8] = zAxis[0];
        orientation[9] = zAxis[1];
        orientation[10] = zAxis[2];
        orientation[11] = 0.0;
        // column3
        orientation[12] = 0.0;
        orientation[13] = 0.0;
        orientation[14] = 0.0;
        orientation[15] = 1.0;

        let translation = mat4.create();
        // column 0
        translation[0] = 1.0;
        translation[1] = 0.0;
        translation[2] = 0.0;
        translation[3] = -eye[0];
        // column 1
        translation[4] = 0.0;
        translation[5] = 1.0;
        translation[6] = 0.0;
        translation[7] = -eye[1];
        // column 2
        translation[8] = 0.0;
        translation[9] = 0.0;
        translation[10] = 1.0;
        translation[11] = -eye[2];
        // column 3
        translation[12] = 0.0;
        translation[13] = 0.0;
        translation[14] = 0.0;
        translation[15] = 1.0;

        let viewMat = mat4.create();
        // Note: first translate, then rotate (which is the inverse
        // of the common transformation concatenation order,
        // because view transform matrix is the inverse of the
        // camera matrix)
        viewMat = mat4.multiply(translation, orientation, viewMat);

        viewMat = mat4.transpose(viewMat);

        this.setViewMatrix(viewMat);
    } // lookAtNaive

    lookAt(to, fromPosition) {
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
        let forward = vec3.create();
        forward = vec3.normalize(vec3.subtract(to, fromPosition, forward));

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
        viewMat[0] = right[0];
        viewMat[1] = up[0];
        viewMat[2] = forward[0];
        viewMat[3] = fromPosition[0];
        viewMat[4] = right[1];
        viewMat[5] = up[1];
        viewMat[6] = forward[1];
        viewMat[7] = fromPosition[1];
        viewMat[8] = right[2];
        viewMat[9] = up[2];
        viewMat[10] = forward[2];
        viewMat[11] = fromPosition[2];
        viewMat[12] = 0.0;
        viewMat[13] = 0.0;
        viewMat[14] = 0.0;
        viewMat[15] = 1.0;

        this.setViewMatrix(viewMat);
    } // lookAt
};