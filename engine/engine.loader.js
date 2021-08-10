class EngineLoader {

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
    static dynamicallyLoadScript(url, domLocation, totalNumber, loaded, finalCallback) {
        // Create a script DOM node
        var script = document.createElement('script');
        // Set its src to the provided URL
        script.src = url;
        script.setAttribute("defer", "defer");

        domLocation.appendChild(script);

        script.onload = () => {
            loaded.number = loaded.number + 1;
            if (totalNumber == loaded.number && finalCallback) {
                finalCallback();
            }
        };
    } // dynamicallyLoadScript

    static loadEngine(finalCallback) {
        let scripts = [
            '../engine/camera/ArcballCamera.js',
            '../engine/controls/Trackball.js',
            '../engine/data/teapot.js',
            '../engine/loader/ObjLoader.js',
            '../engine/loader/TexLoader.js',
            '../engine/math/Matrix.js',
            '../engine/math/MathCommon.js',
            '../engine/mesh/RenderableTriangleMesh.js',
            '../engine/mesh/TriangleMesh.js',
            '../engine/objects/RenderableObject.js',
            '../engine/procedural/Procedural.js',
            '../engine/scene/Scene.js',
            '../engine/shader/InitShaders.js',
            '../engine/utils/WebGLUtils.js'
        ];

        const nbScripts = scripts.length;
        let nbLoaded = {};
        nbLoaded.number = 0;
        for (const script of scripts) {
            EngineLoader.dynamicallyLoadScript(script, document.body,
                nbScripts, nbLoaded, finalCallback);   
        }
    } // loadEngine

} // EngineLoader