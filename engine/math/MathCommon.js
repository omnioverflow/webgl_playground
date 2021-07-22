// =============================================================================
//
// Common math functions
//
// =============================================================================

function isZero(x) {
    const epsilon = 1.0e-7;
    return Math.abs(x) < epsilon;
} // isZero

function isEqual(x, y) {
    const epsilon = 1.0e-7;
    return Math.abs(x - y) < epsilon;
} // isEqual