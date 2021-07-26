//
// Dynamically load a script
// (in spirit of: 
// https://stackoverflow.com/questions/14521108/dynamically-load-js-inside-js
// and
// https://stackoverflow.com/questions/950087/how-do-i-include-a-javascript-file-in-another-javascript-file)
// and
// https://unixpapa.com/js/dyna.html).
// 
// url - external script to load;
// domLocation - is the location to insert <script> element to (e.g. head, body)
function dynamicallyLoadScript(url, domLocation) {
    // Create a script DOM node
    var script = document.createElement('script');
    // Set its src to the provided URL
    script.src = url;

    domLocation.appendChild(script);
}

function engineLoader() {
    dynamicallyLoadScript("../engine/camera/Camera.js", document.body);
    dynamicallyLoadScript("../engine/controls/Trackball.js", document.body);
    dynamicallyLoadScript("../engine/data/teapot.js", document.body);
    dynamicallyLoadScript("../engine/loader/ObjLoader.js", document.body);
    dynamicallyLoadScript("../engine/loader/TexLoader.js", document.body);
    dynamicallyLoadScript("../engine/math/Matrix.js", document.body);
    dynamicallyLoadScript("../engine/math/MathCommon.js", document.body);
    dynamicallyLoadScript("../engine/procedural/Procedural.js", document.body);
    dynamicallyLoadScript("../engine/scene/Scene.js", document.body);
    dynamicallyLoadScript("../engine/shader/InitShaders.js", document.body);
    dynamicallyLoadScript("../engine/utils/WebGLUtils.js", document.body);
} // engineLoader

// Bind loader script to onload event of the window in which
// the script is running (for the lack of better knowledge of 
// how to do that  in other way).
window.addEventListener("load", engineLoader);