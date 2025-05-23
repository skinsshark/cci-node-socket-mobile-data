const SOCKET_URL = window.location.host + '/client';
const socket = io.connect(SOCKET_URL);

let x = 0,
  y = 0,
  z = 0;

let r, g, b;

let otherPlayers = new Map();

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  r = random(255);
  g = random(255);
  b = random(255);

  // button for iOS permission
  btn = createButton('Motion');
  btn.mousePressed(function () {
    DeviceOrientationEvent.requestPermission();
  });

  socket.on('userJoined', (data) => {
    const parsedData = JSON.parse(data);
    otherPlayers.set(parsedData.id, parsedData);
  });

  socket.on('userLeft', (id) => {
    otherPlayers.delete(id);
  });
}

function draw() {
  background(r, g, b);
}
