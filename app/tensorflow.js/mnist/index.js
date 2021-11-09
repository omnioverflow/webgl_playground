/* Basic drawing based on https://stackoverflow.com/questions/22891827/how-do-i-hand-draw-on-canvas-with-javascript */

/**
 * TEMP TODOs & FIXMEs
 * 
 * Take a look at:
 * https://towardsdatascience.com/handwritten-digit-recognition-with-tensorflow-js-6ddb22ae195f
 */

// =============================================================================

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rect {
    constructor(x, y, width, height) {
        if (height <= 0)
            throw 'Rectangle height is negative.';
        if (width <= 0)
            throw 'Rectagnel width is negative.';

        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
    }

    // Check if the input point is inside the rectangle.
    inside(point) {
        return (point.x >= this.x) && (point.x <= (this.x + this.width))
            && (point.y >= this.y) && (point.y <= (this.y + this.height));
    }
};

// =============================================================================

/**
* Important parameters:
* - LINE_WIDTH: when line width is too thin, donwnscaling bitmap for the input
*               to the CNN might result in disconnected strokes, which will 
*               result in drastic degradation of classification results;
* - FONT: font to show classification result over the canvas;
* ----------------------------------------------------------------------------
* - RESULT_X_POS: x-coordinate to put the classification label over the canvas;
* - RESULT_Y_POS: y-coordinate to put the classification label over the canvas;
* - RESULT_RECT: ractangular area where the recognition result must be shown;
* - RESULT_RECT_COLOR_R: red component for result rectangle background color; 
* - RESULT_RECT_COLOR_G: green component for result rectangle background color;
* - RESULT_RECT_COLOR_B: blue component for result rectangle background color;
* ----------------------------------------------------------------------------
* - ALLOW_DRAW_RESULT_RECT: flag to turn on/off drawing on RESULT_RECT area;
* - CANCEL_DRAW_OUTSIDE_CANVAS: cancel the adding new strokes, when input
*                               position leaves the canvas area;
* - GRADIENT_STROKES: use color gradients for the strokes, if set to false
*                     solid random color will be used instead;
* ----------------------------------------------------------------------------
* - DEBUG: turn on/off debug mode such as additional data logging and plots;
* - RECO_SPINNER_TIMEOUT: minimum number of milliseconds to show recognition 
*                         spinner;
* ----------------------------------------------------------------------------
*/
// -----------------------------------------------------------------------------
const LINE_WIDTH = 56;
const FONT = '100px Arial';
// -----------------------------------------------------------------------------
const RESULT_X_POS = 10;
const RESULT_Y_POS = 80;
const RESULT_RECT = new Rect(0, 0, 80, 90);
const RESULT_RECT_COLOR_R = 10;
const RESULT_RECT_COLOR_G = 10;
const RESULT_RECT_COLOR_B = 10;
// -----------------------------------------------------------------------------
const ALLOW_DRAW_RESULT_RECT = false;
const CANCEL_DRAW_OUTSIDE_CANVAS = true;
const GRADIENT_STROKES = true;
// -----------------------------------------------------------------------------
const DEBUG = false;
const RECO_SPINNER_TIMEOUT = 0;
// -----------------------------------------------------------------------------

// =============================================================================

const tf_version = tf.version;
console.log('tvjs: ' + tf_version.tfjs);

// ML model
var model;

/*jslint browser:true */        
"use strict";
var context = document.getElementById('drawing-canvas').getContext("2d");
var canvas = document.getElementById('drawing-canvas');
context = canvas.getContext("2d");
// context.strokeStyle = "#ff0000";
context.lineJoin = "round";
context.lineWidth = LINE_WIDTH;
context.font = FONT;
context.fillStyle = 'white';

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

var colorThreshold = (RESULT_RECT_COLOR_R + RESULT_RECT_COLOR_G
    + RESULT_RECT_COLOR_B) / 3;

// =============================================================================

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// =============================================================================

//The main differences between LayersModel and GraphModels are:
// 1. LayersModel can only be imported from tf.keras or keras HDF5 format model
//    types. GraphModels can be imported from either the aforementioned model
//    types, or TensorFlow SavedModels.
// 2. LayersModels support further training in JavaScript (through its fit() 
//    method). GraphModel supports only inference.
// 3. GraphModel usually gives you higher inference speed (10-20%) than 
//    LayersModel, due to its graph optimization, which is possible thanks to
//    the inference-only support.

// Load layers model.
async function loadLayersModel(url) {
    console.log('Loading Layers model...');
    model = undefined;
    model = await tf.loadLayersModel(url);
}

// Load graph model.
async function loadGraphModel(url) {
    console.log('Loading Graph Model...');
    model = undefined;
    model = await tf.loadGraphModel(url);
    const lol = 0;
}

// =============================================================================
// Debug Plotting.
//

function plotHisto(histData) {
    const data = [
        {
            z: histData,
            type: 'heatmap'
        }
    ];

    Plotly.newPlot('histo', data);
}

function debugPlotTensor2D(tensor) {
    imgTemp = tf.squeeze(tensor);
    // Flix y-axis to point up, instead of down direction which is default in
    // the canvas.
    imgTemp = tf.reverse(imgTemp, 0);
    plotHisto(imgTemp.arraySync());
}

// =============================================================================

function addSpinner() {
    var newDiv = document.createElement("div");
    newDiv.setAttribute('class', 'loader');
    newDiv.setAttribute('id', 'reco-spinner');
    newDiv.innerHTML = '<svg class="circular" viewBox="25 25 50 50"> <circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10"/></svg>';

    var parent = document.getElementById('wrapper');
    parent.appendChild(newDiv);
}

function removeSpinner() {
    const spinner = document.getElementById('reco-spinner');
    var parent = document.getElementById('wrapper');
    parent.removeChild(spinner);
}

function toMatrix(arr, width) {
  return arr.reduce(function (rows, key, index) { 
    return (index % width == 0 ? rows.push([key]) 
      : rows[rows.length-1].push(key)) && rows;
  }, []);
}

async function runPrediction() {
    initRecoArea();
    addSpinner();

    // For more in tfjs inference, see example: 
    // https://blog.pragmatists.com/machine-learning-in-the-browser-with-tensorflow-js-2f941a8130f5
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    // Image that we obtained from the html5 canvas is rgb,
    // we need to convert it to grayscale though as required 
    // by trained tf model.
    let grayscale = imageData;
    // image data is in RGBA format, so step is 4
    const step = 4;
    for (var i = 0; i < grayscale.data.length; i += step) {
        const rgbWeights = [0.2989, 0.5870, 0.1140];
        let grayPixel = 0;
        for (var j = 0; j < 3; ++j)
            grayPixel += rgbWeights[j] * imageData.data[i + j];
            // grayPixel = parseInt((grayscale.data[i] + grayscale.data[i + 1] + grayscale.data[i + 2]) / 3);
        // if (pixel > colorThreshold)
        //     pixel = 255;
        // else
        //     pixel = 0;

        for (var j = 0; j < 3; ++j) {
            const gray = Math.floor(grayPixel);
            if (gray < colorThreshold)
                grayscale.data[i + j] = 0;
            else
                grayscale.data[i + j] = Math.floor(grayPixel);
        }

        // // Zero-center the bitmap image pixel values
        // const PIXEL_DEPTH = 255;
        // for (var j = 0; j < step; ++j) {
        //     const centered = (grayscale.data[i + j] - PIXEL_DEPTH / 2.0) / PIXEL_DEPTH;
        //     grayscale.data[i + j] = centered;
        // }
    }

    const numChannels = 4;
    const pixelDepth = 255;
    var inputTensor = tf.browser.fromPixels(grayscale, 4)
        .resizeBilinear([28, 28])
        // .reshape([1, 28, 28, 1])
        .cast('float32')
        .sub(pixelDepth / 2.0)
        .div(255);

    console.clear();
    console.log(inputTensor.shape);
    inputTensor = tf.slice(inputTensor, [0, 0, 0], [28, 28, 1]);
    console.log(inputTensor.shape)
    const tt = tf.squeeze(inputTensor);
    let tnp = tt.dataSync();

    tnp = tnp.map(tnp => tnp.toFixed(1));

    const m = toMatrix(tnp, 28);
    for (var k = 0; k < 28; ++k) {
        let row = m[k];
        // row = row.map(row => row.toFixed(3));
        console.log(row);
    }

    inputTensor = inputTensor.reshape([1, 28, 28, 1]);

    // const inputTensor = tf.zeros([1, 28, 28, 1], dtype='float32');
    // const inputTensor = tf.ones([1, 28, 28, 1], dtype='float32');
    // var inputTensor = tf.eye(28);
    // inputTensor = inputTensor.reshape([1, 28, 28, 1]);

    model.getWeights()[0].print();
    const logits = model.predict(inputTensor).dataSync();
    const probs = tf.argMax(tf.softmax(logits)).dataSync();
    const classificationResult =  model.predict(inputTensor).argMax(-1);
    classificationResult.print();

    // Optional debug plotting
    if (DEBUG)
        debugPlotTensor2D(inputTensor);    

    const classificationData = await classificationResult.data();
    const topScoreIndex = classificationData[0];

    // var imax = 0;
    // var x = 0;
    // const reducer = (imax, x, i, arr) =>
    //      x > arr[imax] ? i : imax;
    // const topScoreIndex = classificationData.reduce(reducer, 0);

    setTimeout(function() {
        removeSpinner();
    }, RECO_SPINNER_TIMEOUT);

    showRecoResult(topScoreIndex);
}

function clearRecoArea() {
    context.clearRect(RESULT_RECT.x, RESULT_RECT.y, RESULT_RECT.width, RESULT_RECT.height);
}

function setupRecoArea() {
    context.beginPath();
    context.rect(RESULT_RECT.x, RESULT_RECT.y, RESULT_RECT.width, RESULT_RECT.height);
    context.fillStyle = 'rgb(' + RESULT_RECT_COLOR_R.toString()
        + ', ' + RESULT_RECT_COLOR_G.toString() + ', '
        + RESULT_RECT_COLOR_B.toString() + ', 1.0)';
    context.fill();
}

function showRecoResult(score) {
    initRecoArea();

    const classifiedRes = score.toString();
    context.fillStyle = 'rgb(255, 255, 255, 1.0)';
    context.fillText(classifiedRes, RESULT_X_POS, RESULT_Y_POS);
}

function initContext() {
    context.lineCap = 'round';
}

function initRecoArea() {
    clearRecoArea();
    setupRecoArea();
}

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    initRecoArea();
}

// =============================================================================

function insideCanvas(p) {
    const canvasRect = new Rect(0, 0, canvas.width, canvas.height);
    return canvasRect.inside(p);
}

/**
 * Add information where the user clicked at.
 * @param {number} x
 * @param {number} y
 * @return {boolean} dragging
 */
function addClick(x, y, dragging) {    
    const withinResultRect = RESULT_RECT.inside(new Point(x, y));
    const strokeInsideCanvas = insideCanvas(new Point(x, y));
    if (!ALLOW_DRAW_RESULT_RECT && withinResultRect || !strokeInsideCanvas) {        
        clickX = [];
        clickY = [];
        clickDrag = [];

        if (!strokeInsideCanvas)
            paint = false;

        return;
    }

    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Redraw the complete canvas.
 */
function redraw() {
    clearCanvas();

    for (var i = 0; i < clickX.length; i += 1) {
        if (!clickDrag[i] && i == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else if (!clickDrag[i] && i > 0) {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.lineTo(clickX[i], clickY[i]);
            context.stroke();
        }
    }
}

/**
 * Draw the newly added point.
 * @return {void}
 */
function drawNew(strokeStyle) {    
    context.strokeStyle = strokeStyle;

    var i = clickX.length - 1
    if (!clickDrag[i]) {
        if (clickX.length == 0) {
            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        } else {
            context.closePath();

            context.beginPath();
            context.moveTo(clickX[i], clickY[i]);
            context.stroke();
        }
    } else {
        context.lineTo(clickX[i], clickY[i]);
        context.stroke();
    }
}

function getRandomStyle() {
    const r = Math.floor(Math.random() * 155) + 100;
    const g = Math.floor(Math.random() * 155) + 100;
    const b = Math.floor(Math.random() * 155) + 100;
    
    return rgbToHex(r, g, b);
}

function mouseDownEventHandler(e) {
    paint = true;
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;

    if (paint) {
        addClick(x, y, false);

        var style = getRandomStyle();
        if (GRADIENT_STROKES) {
            var gradient = context.createLinearGradient(0, 0, 
                canvas.width, canvas.height);

            // Shuffle color stops.
            var colorStops = [0.0, 0.125, 0.25, 0.325, 0.45, 0.575, 0.7, 0.825];
            var colorIds = [0, 1, 2, 3, 4, 5, 6, 7];
            var colors = ['magenta', 'blue', 'darkturquoise', 'purple', 'red',
                'cyan', 'darkblue', 'orange'];        

            for (var i = 0; i < Math.floor(colors.length / 2); ++i) {
                const swapId = Math.floor(Math.random() * (colorIds.length - i))
                    + i;
                const temp = colors[i];
                colors[i] = colors[swapId];
                colors[swapId] = temp;
            }

            for (var i = 0; i < colors.length; ++i) {
                gradient.addColorStop(colorStops[i].toString(), colors[i]);
            }

            style = gradient;
        }

        drawNew(style);
    }
}

function touchstartEventHandler(e) {
    paint = true;
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, false);
        drawNew();
    }
}

function mouseUpEventHandler(e) {
    // context.closePath();
    paint = false;
}

function mouseMoveEventHandler(e) {
    var x = e.pageX - canvas.offsetLeft;
    var y = e.pageY - canvas.offsetTop;
    if (paint) {
        addClick(x, y, true);
        drawNew();
    }
}

function touchMoveEventHandler(e) {
    if (paint) {
        addClick(e.touches[0].pageX - canvas.offsetLeft, e.touches[0].pageY - canvas.offsetTop, true);
        drawNew();
    }
}

function setUpHandler(isMouseandNotTouch, detectEvent) {
    removeRaceHandlers();
    if (isMouseandNotTouch) {
        canvas.addEventListener('mouseup', mouseUpEventHandler);
        canvas.addEventListener('mousemove', mouseMoveEventHandler);
        canvas.addEventListener('mousedown', mouseDownEventHandler);
        mouseDownEventHandler(detectEvent);
    } else {
        canvas.addEventListener('touchstart', touchstartEventHandler);
        canvas.addEventListener('touchmove', touchMoveEventHandler);
        canvas.addEventListener('touchend', mouseUpEventHandler);
        touchstartEventHandler(detectEvent);
    }
}

function mouseWins(e) {
    setUpHandler(true, e);
}

function touchWins(e) {
    setUpHandler(false, e);
}

function removeRaceHandlers() {
    canvas.removeEventListener('mousedown', mouseWins);
    canvas.removeEventListener('touchstart', touchWins);
}

function serializeCanvas() {
    alert(canvas.toDataURL());
    console.log(canvas.toDataURL())
}

function deserializeCanvas() {
    var img = new Image;
    img.onload = function(){
        context.drawImage(img, 0, 0);
    };
    // Hard-coded (data-collected) handwritten digit (8).
    img.src = 'data:image/png;base64,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';
}

// Register listeners
canvas.addEventListener('mousedown', mouseWins);
canvas.addEventListener('touchstart', touchWins);
document.getElementById("clear-button").addEventListener("click", clearCanvas);
document.getElementById('reco-button').addEventListener('click', runPrediction);
document.getElementById("serialize-button").addEventListener("click", serializeCanvas);
document.getElementById("deserialize-button").addEventListener("click", deserializeCanvas);

// =============================================================================

// Deserialize handwritten digit in the canvas from data URL.
// deserializeCanvas();

// Load ML model
// loadGraphModel('https://iirthw.github.io/downloads/models/tfjs_mnist_cnn_36/model.json');
// loadLayersModel('https://iirthw.github.io/downloads/models/tfjs_mnist_full_0.9/model.json');
// loadLayersModel('https://iirthw.github.io/downloads/models/mnist/012/model/model.json');
loadLayersModel('https://iirthw.github.io/downloads/models/mnist/zero_centered/0-9/model_2epo/model.json');

initRecoArea();
initContext();