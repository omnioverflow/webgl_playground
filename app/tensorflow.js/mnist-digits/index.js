/* Basic drawing based on https://stackoverflow.com/questions/22891827/how-do-i-hand-draw-on-canvas-with-javascript */

const tf_version = tf.version;
console.log('tvjs: ' + tf_version.tfjs);

/*jslint browser:true */        
"use strict";
var context = document.getElementById('sheet').getContext("2d");
var canvas = document.getElementById('sheet');
context = canvas.getContext("2d");
// context.strokeStyle = "#ff0000";
context.lineJoin = "round";
context.lineWidth = 5;

var clickX = [];
var clickY = [];
var clickDrag = [];
var paint;

// =============================================================================

async function loadModel(path, model) {
    // FIXME: missing impl.
}

// =============================================================================

function componentToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

// =============================================================================

/**
 * Add information where the user clicked at.
 * @param {number} x
 * @param {number} y
 * @return {boolean} dragging
 */
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
}

/**
 * Redraw the complete canvas.
 */
function redraw() {
    // Clears the canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

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
        const randomStyle = getRandomStyle();
        drawNew(randomStyle);
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
    context.closePath();
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

function clearCanvas() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function serializeCanvas() {
    alert(canvas.toDataURL());
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
document.getElementById("serialize-button").addEventListener("click", serializeCanvas);
document.getElementById("deserialize-button").addEventListener("click", deserializeCanvas);


// Deserialize handwritten digit in the canvas from data URL.
deserializeCanvas();

// Load ML model
loadModel('models', 'mnist_cnn_36.json');