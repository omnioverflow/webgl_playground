// =============================================================================
//
// Wavefront OBJ file loader
//
// =============================================================================

// Code based on https://webglfundamentals.org/webgl/lessons/webgl-load-obj.html
async function loadOBJ(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw '[loadOBJ] Cannot load from ' + url;
    }

    const text = await response.text();

    return parseOBJ(text);
} // loadOBJ

function parseOBJ(text) {
    const keywords = {
    };
 
    const keywordRE = /(\w*)(?: )*(.*)/;
    const lines = text.split('\n');
    for (let lineNo = 0; lineNo < lines.length; ++lineNo) {
    const line = lines[lineNo].trim();
    if (line === '' || line.startsWith('#')) {
      continue;
    }
    const m = keywordRE.exec(line);
    if (!m) {
      continue;
    }
    const [, keyword, unparsedArgs] = m;
    const parts = line.split(/\s+/).slice(1);
    const handler = keywords[keyword];
    if (!handler) {
      console.warn('unhandled keyword:', keyword, 'at line', lineNo + 1);
      continue;
    }
    handler(parts, unparsedArgs);
  }
} // parseOBJ