const SOCKET_URL = window.location.host + '/client';
const socket = io.connect(SOCKET_URL);

let x = 0,
  y = 0,
  z = 0;

let otherPlayers = new Map();

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
  background('blue');

  x += accelerationX * 0.05;
  y += accelerationY * 0.05;
  z += accelerationZ * 0.05;
  rotateX(x);
  rotateY(y);
  rotateZ(z);
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
