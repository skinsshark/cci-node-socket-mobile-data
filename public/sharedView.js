const SOCKET_URL = window.location.host;
const socket = io.connect(SOCKET_URL + '/sharedView');

const users = new Map();

function setup() {
  createCanvas(windowWidth * 0.8, windowHeight * 0.8, WEBGL);

  socket.on('userJoined', onUserJoined);
  socket.on('userUpdate', onUserUpdate);
  socket.on('userLeft', onUserLeft);

  angleMode(DEGREES);
  rectMode(CENTER);
  textAlign(CENTER);

  // in webGL mode, you have to load font via file, so I picked an
  // open source one from google fonts.
  const font = loadFont(
    'https://cdn.glitch.global/1168cb3c-db51-4813-957f-0fdb53115574/RobotoMono-VariableFont_wght.ttf?v=1747705361935'
  );
  textFont(font);
}

function draw() {
  background('green');

  x += accelerationX * 0.05;
  y += accelerationY * 0.05;
  z += accelerationZ * 0.05;
  rotateX(x);
  rotateY(y);
  rotateZ(z);
  fill('red');
  box(200, 200, 200);

  const data = {
    id: socket.id,
    x,
    y,
    z,
  };
  socket.emit('update', JSON.stringify(data));

  // draw other players' boxes
  for (let id in otherPlayers) {
    const player = otherPlayers[id];
    push();
    translate(player.x * 10, player.y * 10, player.z * 10);
    rotateX(player.x);
    rotateY(player.y);
    rotateZ(player.z);
    fill('red');
    box(100, 100, 100);
    pop();
  }
}

function onUserJoined(data) {
  console.log('joined: ' + data.id);
  users.set(data.id, {});
}

function onUserUpdate(data) {
  // the client sent data to the server as a string,
  // so we need to parse it back out into JSON.
  const json = JSON.parse(data);
  //console.log("updated: " + json.id);
  if (json.id) {
    users.set(json.id, json);
  }
}

function onUserLeft(data) {
  console.log(`user left ${data.id}`);
  users.delete(data.id);
}

function touchStarted(e) {
  e.preventDefault();
}

/* leave this here so that Glitch will not mark global p5.js functions as errors */
/* globals io, ADD, ALT, ARROW, AUDIO, AUTO, AXES, BACKSPACE, BASELINE, BEVEL, BEZIER, BLEND, BLUR, BOLD, BOLDITALIC, BOTTOM, BURN, CENTER, CHORD, CLAMP, CLOSE, CONTROL, CORNER, CORNERS, CROSS, CURVE, DARKEST, DEGREES, DEG_TO_RAD, DELETE, DIFFERENCE, DILATE, DODGE, DOWN_ARROW, ENTER, ERODE, ESCAPE, EXCLUSION, FALLBACK, FILL, GRAY, GRID, HALF_PI, HAND, HARD_LIGHT, HSB, HSL, IMAGE, IMMEDIATE, INVERT, ITALIC, LABEL, LANDSCAPE, LEFT, LEFT_ARROW, LIGHTEST, LINEAR, LINES, LINE_LOOP, LINE_STRIP, MIRROR, MITER, MOVE, MULTIPLY, NEAREST, NORMAL, OPAQUE, OPEN, OPTION, OVERLAY, P2D, PI, PIE, POINTS, PORTRAIT, POSTERIZE, PROJECT, QUADRATIC, QUADS, QUAD_STRIP, QUARTER_PI, RADIANS, RADIUS, RAD_TO_DEG, REMOVE, REPEAT, REPLACE, RETURN, RGB, RIGHT, RIGHT_ARROW, ROUND, SCREEN, SHIFT, SOFT_LIGHT, SQUARE, STROKE, SUBTRACT, TAB, TAU, TESS, TEXT, TEXTURE, THRESHOLD, TOP, TRIANGLES, TRIANGLE_FAN, TRIANGLE_STRIP, TWO_PI, UP_ARROW, VIDEO, WAIT, WEBGL, accelerationX, accelerationY, accelerationZ, deltaTime, deviceOrientation, displayHeight, displayWidth, focused, frameCount, height, isKeyPressed, key, keyCode, keyIsPressed, mouseButton, mouseIsPressed, mouseX, mouseY, movedX, movedY, pAccelerationX, pAccelerationY, pAccelerationZ, pRotateDirectionX, pRotateDirectionY, pRotateDirectionZ, pRotationX, pRotationY, pRotationZ, pixels, pmouseX, pmouseY, pwinMouseX, pwinMouseY, rotationX, rotationY, rotationZ, touches, turnAxis, width, winMouseX, winMouseY, windowHeight, windowWidth, abs, acos, alpha, ambientLight, ambientMaterial, angleMode, append, applyMatrix, arc, arrayCopy, asin, atan, atan2, background, beginContour, beginShape, bezier, bezierDetail, bezierPoint, bezierTangent, bezierVertex, blend, blendMode, blue, boolean, box, brightness, byte, camera, ceil, char, circle, clear, clearStorage, color, colorMode, concat, cone, constrain, copy, cos, createA, createAudio, createButton, createCamera, createCanvas, createCapture, createCheckbox, createColorPicker, createDiv, createElement, createFileInput, createGraphics, createImage, createImg, createInput, createNumberDict, createP, createRadio, createSelect, createShader, createSlider, createSpan, createStringDict, createVector, createVideo, createWriter, cursor, curve, curveDetail, curvePoint, curveTangent, curveTightness, curveVertex, cylinder, day, debugMode, degrees, describe, describeElement, directionalLight, displayDensity, dist, downloadFile, ellipse, ellipseMode, ellipsoid, emissiveMaterial, endContour, endShape, erase, exitPointerLock, exp, fill, filter, float, floor, fract, frameRate, frustum, fullscreen, get, getFrameRate, getItem, getURL, getURLParams, getURLPath, green, gridOutput, hex, hour, httpDo, httpGet, httpPost, hue, image, imageMode, int, isLooping, join, keyIsDown, lerp, lerpColor, lightFalloff, lightness, lights, line, loadBytes, loadFont, loadImage, loadJSON, loadModel, loadPixels, loadShader, loadStrings, loadTable, loadXML, log, loop, mag, map, match, matchAll, max, millis, min, minute, model, month, nf, nfc, nfp, nfs, noCanvas, noCursor, noDebugMode, noErase, noFill, noLights, noLoop, noSmooth, noStroke, noTint, noise, noiseDetail, noiseSeed, norm, normalMaterial, orbitControl, ortho, perspective, pixelDensity, plane, point, pointLight, pop, popMatrix, popStyle, pow, print, push, pushMatrix, pushStyle, quad, quadraticVertex, radians, random, randomGaussian, randomSeed, rect, rectMode, red, redraw, registerPromisePreload, removeElements, removeItem, requestPointerLock, resetMatrix, resetShader, resizeCanvas, reverse, rotate, rotateX, rotateY, rotateZ, round, saturation, save, saveCanvas, saveFrames, saveGif, saveJSON, saveJSONArray, saveJSONObject, saveStrings, saveTable, scale, second, select, selectAll, set, setAttributes, setCamera, setFrameRate, setMoveThreshold, setShakeThreshold, shader, shearX, shearY, shininess, shorten, shuffle, sin, smooth, sort, specularColor, specularMaterial, sphere, splice, split, splitTokens, spotLight, sq, sqrt, square, storeItem, str, stroke, strokeCap, strokeJoin, strokeWeight, subset, tan, text, textAlign, textAscent, textDescent, textFont, textLeading, textOutput, textSize, textStyle, textWidth, texture, textureMode, textureWrap, tint, torus, translate, triangle, trim, unchar, unhex, updatePixels, vertex, writeFile, year */
