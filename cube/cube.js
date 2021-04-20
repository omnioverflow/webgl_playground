// =============================================
// Glob vars
// =============================================
var gl;
// Create arrays to hold VBO data
var points = [];    // geometry
var colors = [];    // color per point (geometry)
var numVertices = 0;

// =============================================
// Animation
// =============================================
var rotationFlag = true;
var axis = 0;
var theta = [ 45.0, 45.0, 45.0 ];
var thetaId;
var proj = [1.0, 1.0, 1.5];
var projId;
var xAxis = 0;
var yAxis = 1;
var zAxis = 2;

var fpsNode;

// Sager NP7856 15.6 Inches Thin Bezel FHD 240Hz Gaming Laptop, Intel Core i7-9750H,
//  NVIDIA RTX 2060 6GB DDR6, 32GB RAM, 500GB NVMe SSD + 1TB HDD, Window

// =============================================
// Set up GL, init and render
// =============================================
window.onload = function init()
{
  var canvas = document.getElementById( "gl-canvas" );
  gl = WebGLUtils.setupWebGL( canvas );
  if ( !gl ) 
  {
    alert( "WebGL isn't available" );
  }


  // look up the fps element
  var fpsElement = document.getElementById("fps");
  // Create fps text node
  fpsNode = document.createTextNode("");
  fpsElement.appendChild(fpsNode);
  
  colorCube();

  // Configure WebGL
  gl.viewport( 0, 0, canvas.width, canvas.height );
  gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
  // Enable HSR
  gl.enable(gl.DEPTH_TEST)

  // Load shaders and initialize attribute buffers
  var program = initShaders( gl, "vertex-shader", "fragment-shader" )
  gl.useProgram( program );

  // Load the data into the GPU
  // (1) Color Buffer
  var cBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, cBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(colors), gl.STATIC_DRAW );

  // Associate out shader variables with color data buffer
  var vColor = gl.getAttribLocation( program, "vColor" );
  gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vColor );

  // (1) Color Buffer
  var vBufferId = gl.createBuffer();
  gl.bindBuffer( gl.ARRAY_BUFFER, vBufferId );
  gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );

  // Associate out shader variables with vertex data buffer
  var vPosition = gl.getAttribLocation( program, "vPosition" );
  gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
  gl.enableVertexAttribArray( vPosition );

  thetaId = gl.getUniformLocation( program, "theta" )

  projId = gl.getUniformLocation(program, "projection");   

  // register listeners of the ui controls
  registerListeners();

  render();
};

// =============================================
/// Render
// =============================================

function render()
{
  var renderStart = getCurrentMillis();

  // Clear both color buffer and depth buffer
  gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT ); 

  if ( rotationFlag ) {
    theta[axis] += 1.0;
  }
  gl.uniform3fv(thetaId, theta);
  gl.uniform3fv(projId, proj);

  gl.drawArrays( gl.TRIANGLES, 0, numVertices );

  var renderEnd = getCurrentMillis();
  renderFps( computeFpsFromMillis(renderStart, renderEnd) );

  // Needed for redrawing if anything is changing
  requestAnimFrame( render );
}

function getCurrentMillis()
{
  return performance.now();
  // var currDate = new Date();
  // return currDate.getMilliseconds();
}

function computeFpsFromMillis( start, end )
{
    var elapsedMillis = end - start; 
    if ( elapsedMillis < 0 )
    {
      return 0;
    }
    else if ( elapsedMillis == 0 )
      return -1;

    var fps = Math.round(1000 / elapsedMillis);
    if (fps < 1)
    {
      return 0;
    }
    else 
    {
      return fps;
    }
}

function renderFps( fps )
{
  if ( fps < 0 )
    fpsNode.nodeValue = " ~ ∞";

  fpsNode.nodeValue = fps.toString();
}

// =============================================
/// Transformations
// =============================================

function rotXMat()
{

}

function rotYMat()
{

}

function rotZMat()
{

}

function viewMat()
{

}

function projMat()
{
  
}


// =============================================
/// Geometric helpers
// =============================================

function setRotationAxis( axis_ )
{
  axis = axis_;
}

function quad(a, b, c, d) {
  var vertices = [
    vec4( -0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5,  0.5,  0.5, 1.0 ),
    vec4(  0.5, -0.5,  0.5, 1.0 ),
    vec4( -0.5, -0.5, -0.5, 1.0 ),
    vec4( -0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5,  0.5, -0.5, 1.0 ),
    vec4(  0.5, -0.5, -0.5, 1.0 )
  ];

  var vertexColors = [
    [ 0.0, 0.0, 0.0, 1.0 ], // black
    [ 1.0, 0.0, 0.0, 1.0 ], // red
    [ 1.0, 1.0, 0.0, 1.0 ], // yellow
    [ 0.0, 1.0, 0.0, 1.0 ], // green

    [ 0.0, 0.0, 1.0, 1.0 ], // blue
    [ 1.0, 0.0, 1.0, 1.0 ], // magenta
    [ 0.0, 1.0, 1.0, 1.0 ], // cyan
    [ 1.0, 1.0, 1.0, 1.0 ]  // white
  ];

  var indices = [ a, b, c, a, c, d ];
  numVertices += indices.length;
  for ( var i = 0; i < indices.length; ++i ) {
    points.push( vertices[indices[i]] );

    // for vertex colors
    colors.push( vertexColors[indices[i]] );

    // for solid colored faces
    // colors.push(vertexColors[3]);
  }
}

function colorCube() {
  quad( 1, 0, 3, 2 );
  quad( 2, 3, 7, 6 );
  quad( 3, 0, 4, 7 );

  quad( 6, 5, 1, 2 );
  quad( 4, 5, 6, 7 );
  quad( 5, 4, 0, 1 );
}

function wheelCallback( event )
{
  var key = event.key || event.keyCode;
  var obj = { k: key }
  console.log(key);
  if (key == '+')
    proj[2] += 200;
}

// =============================================
/// Listeners
// =============================================
function registerListeners() {
  document.getElementById( "xButton" ).onclick = function() { axis = xAxis; };
  document.getElementById( "yButton" ).onclick = function() { axis = yAxis; };
  document.getElementById( "zButton" ).onclick = function() { axis = zAxis; };
  document.getElementById( "toggleButton" ).onclick = function() { rotationFlag = !rotationFlag; };
  document.addEventListener( "wheel", wheelCallback, false );
  document.addEventListener("keyup", wheelCallback);
}