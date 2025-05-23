const SOCKET_URL = window.location.host + '/client';
const socket = io.connect(SOCKET_URL);

let x = 0,
  y = 0,
  z = 0;

let otherPlayers = new Map();

// Set up the sketch canvas and socket connection,
// including callback function for when the socket receives data.
function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

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
  background(255);

  // Rotate the box based on accelerometer data
  x += accelerationX * 0.05;
  y += accelerationY * 0.05;
  z += accelerationZ * 0.05;
  rotateX(x);
  rotateY(y);
  rotateZ(z);
  box(200, 200, 200);

  // Emit your data to the server
  const data = {
    id: socket.id,
    x,
    y,
    z,
  };
  socket.emit('update', JSON.stringify(data));

  // Draw other players' boxes
  for (let id in otherPlayers) {
    const player = otherPlayers[id];
    push();
    translate(player.x * 10, player.y * 10, player.z * 10);
    rotateX(player.x);
    rotateY(player.y);
    rotateZ(player.z);
    fill(100, 150, 255, 150);
    box(100, 100, 100);
    pop();
  }
}
