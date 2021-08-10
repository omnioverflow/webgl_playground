// =============================================================================
//
// Implementation of ArcballCamera
//
// =============================================================================

// FIXME: resolve all fixmes

class ArcballCamera {
    // -------------------------------------------------------------------------
    #position           // camera position;
    #target             // where the camera looks at;
    #pivot              // pivot point (anchor) around which camera can be rotated;
    // -------------------------------------------------------------------------
    #viewMatrix         // view matrix (to camera/eye space);
    #projectionMatrix   // projection matrix (to clip space);
    // -------------------------------------------------------------------------
    #throwOnError       // throw if any error (no forgiveness);
    // -------------------------------------------------------------------------

    // FIXME: get rid of canvas argument if possible

    constructor(position, target, pivot, up, canvas,
                projectionType = "projection-hardcoded",
                throwOnError = false) 
    {
        this.#position = position;
        this.#target = target;
        // FIXME: rotate camera around its pivot
        this.#pivot = pivot;

        // TODO: make projection matrix flexible
        switch (projectionType) {
            case 'projection-auto':
                // Create a perspective matrix, a special matrix that is
                // used to simulate the distortion of perspective in a camera.
                // Our field of view is 45 degrees, with a width/height
                // ratio that matches the display size of the canvas
                // and we only want to see objects between 0.1 units
                // and 100 units away from the camera.

                // vertical field-of-view
                const fovy = 60 * Math.PI / 180;   // in radians
                const aspect = canvas.clientWidth / canvas.clientHeight;
                const z_near = -0.01;
                const z_far = 100.0;

                this.#projectionMatrix = mat4.perspective(fovy, aspect, z_near, z_far);
                break;
            case 'projection-hardcoded':
                this.#projectionMatrix = new Float32Array(
                    [1.8106601238250732, 0, 0, 0,
                     0, 2.4142136573791504, 0, 0,
                     0, 0, -1.0020020008087158, -1,
                     0, 0, -0.20020020008087158, 0
                    ]);
                break;
            case 'projection-identity':
                this.#projectionMatrix = mat4.identity();
                break;
            case 'projection-ortho':
                const size = 30.0;
                const left = -size;
                const right = size;
                const bottom = -size;
                const top = size;
                const near = -size; 
                const far = size;
                this.#projectionMatrix = mat4.ortho(left, right, bottom, top, near, far);
                break;
            default:
                throw '[camera] Unsupported projection type';
                break;
        }

        this.lookAt(position, target, up);
    } // ctor

    // -------------------------------------------------------------------------

    /**
     * Rotates camera around the pivot point.
     */
    rotateAroundPivot(quatRot) {
        let eyeToTarget = vec3.create();
        eyeToTarget = vec3.subtract(this.#target, this.#position, 
            eyeToTarget);
        const eyeToTargetDistance = vec3.length(eyeToTarget);

        // Final transform matrix:
        // T' * R * T
        // where T - translation to the pivot,
        // R - rotation 
        // T' - inverse transform to T

        // Get rotation matrix
        let transform = quat4.toMat4(quatRot);

        // R * T
        let translateOrigin = mat4.identity();
        translateOrigin = mat4.translate(translateOrigin, 
            this.#pivot, 
            translateOrigin);
        transform = mat4.multiply(transform,
            translateOrigin,
            transform);

        // Get T'
        let inverseTranslation = vec3.create();
        inverseTranslation = vec3.negate(this.#pivot, inverseTranslation);

        translateOrigin = mat4.identity();
        translateOrigin = mat4.translate(translateOrigin,
            inverseTranslation, 
            translateOrigin);

        // T' * (R * T)
        transform = mat4.multiply(translateOrigin, 
            transform, 
            transform);

        let rotation = transform;

        let newPosition = vec4.create();
        newPosition[0] = this.#position[0];
        newPosition[1] = this.#position[1];
        newPosition[2] = this.#position[2];
        newPosition[3] = 1.0;
        
        newPosition = mat4.multiplyVec4(rotation, newPosition, newPosition);

        if (this.#throwOnError)
        {
            let newEyeToTarget = vec3.create();
            newEyeToTarget = vec3.subtract(this.#position, this.#target, 
                newEyeToTarget);
            const newEyeToTargetDistance = vec3.length(newEyeToTarget);

            if (newEyeToTargetDistance != eyeToTargetDistance)
                throw '[camera] Eye-to-target distance changed after rotation.';
        }

        // Keep the eye to target distance
        // TODO: investigate, why the computed rotation,
        // obtained from quatRot, for some reason
        // is not a pure rotation matrix
        // (does not satisy R * R_T == R_T * R
        newPosition = vec3.normalize(newPosition);
        newPosition = vec3.scale(newPosition, eyeToTargetDistance, newPosition);

        this.lookAt(newPosition,
                   this.#target,
                   vec3.create(new Float32Array([0, 1, 0])));
    } // rotateAroundPivot

    /**
     * Point camera at the specified poiont.
     */
    lookAt(to) {
        this.#target = to;
        lookAt(to, this.#position);
    } // lookAt

    /**
     * Point camera at specified point, given camera position and the up vector
     * (unoptimized implementation).
     */
    lookAt(eye, target, up) {
        this.#position = eye;
        this.#target = target;

        let forward = vec3.create();
        // forward = normalize(eye - target)
        forward = vec3.normalize(vec3.subtract(eye, target, forward));

        {
            // Check the corner case, when forward vector is 
            // collinear with the up vector
            const dotForwardUp = vec3.dot(forward, up);
            if (isZero(dotForwardUp)) {
                throw "[camera] Forward vector is collinear with the up vector";
            }
        }

        let sideways = vec3.create();
        // sideways = up x forward
        sideways = vec3.normalize(vec3.cross(up, forward, sideways));
        let u = vec3.create();
        // up and forward are not necessary orthogonal,
        // therefore in order to get orthonormal coordinate system
        // we compute another 'up' vector u, as follows
        // u = forward x sideways
        u = vec3.cross(forward, sideways, u);

        let orientation = mat4.identity();
        // column 0
        orientation[0] = sideways[0];
        orientation[1] = u[0];
        orientation[2] = forward[0];
        orientation[3] = 0.0;
        // column 1
        orientation[4] = sideways[1];
        orientation[5] = u[1];
        orientation[6] = forward[1];
        orientation[7] = 0.0;
        // column 2
        orientation[8] = sideways[2];
        orientation[9] = u[2];
        orientation[10] = forward[2];
        orientation[11] = 0.0;

        let translation = mat4.identity();
        // column 3
        translation[12] = -eye[0];
        translation[13] = -eye[1];
        translation[14] = -eye[2];
        translation[15] = 1.0;

        let viewMat = mat4.create();
        // Note: first translate, then rotate (which is the inverse
        // of the common transformation concatenation order,
        // because view transform matrix is the inverse of the
        // camera matrix)
        // orientation = mat4.transpose(orientation);
        viewMat = mat4.multiply(orientation, translation, viewMat);

        this.setViewMatrix(viewMat);
    } // lookAt


    /**
     * Move camera delta units away along the camera view direction.
     */
    moveAway(delta) {
        if (delta > 0.0)
            throw '[camera] Invalid delta argument to moveAway method.';
        else if (!isZero(delta))
            moveAlongViewingDirection(delta);            

    } // moveAway

    /**
     * Move camera delta units closer along the camera view direction.
     */
    moveCloser(delta) {
        if (delta < 0.0)
            throw '[camera] Invalid delta argument to moveClose method.';
        else if (!isZero(delta))
            moveAlongViewingDirection(delta);
    } // moveCloser

    /**
     * Move camera away or closer along the camera view direction.
     */
    moveAlongViewingDirection(delta) {
        // FIXME: provide impl
    } // moveAlongViewingDirection

    // -------------------------------------------------------------------------

    get position() { return this.#position; }
    get target() { return this.#target; }
    get viewMatrix() { return this.#viewMatrix; }
    get projectionMatrix() { return this.#projectionMatrix; }
    setViewMatrix(value) { this.#viewMatrix = value; }

    // -------------------------------------------------------------------------
}; // class ArcballCamera