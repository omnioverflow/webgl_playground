var image1 = new Array()
  for (var i = 0; i < texSize; i++) image1[i] = new Array();
  for (var i = 0; i < textSize; i++) 
    for (var j = 0; j < texSize; j++)
      image1[i][j] = new Float32Array(4);
  for (var i = 0; i < texSize; i++) 
    for (var j = 0; j < texSize; j++) {
      var c = (((i & 0x8) == 0) ^ ((j & 0x8) == 0));
      image1[i][j] = [c, c, c, 1];
    }

// convert floats to ubytes for texture
var image2 = new Uint8Array(4 * texSize * texSize);
  for (var i = 0; i < texSize; i++)
    for (var j = 0; j < texSize; j++)
      for (var k = 0; k < 4; k++)
        image2[4 * texSize * i + 4 * j + k] = 255 * image1[i][j][k];