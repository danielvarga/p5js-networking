// https://editor.p5js.org/enickles/sketches/Ei8qdKgsL

const ngrok = "21105165";

let camera, receivedImage;

let socket;

let posX = 640 + 20
let posY = 50

const thumbWidth = 160
const thumbHeight = 120

function setup() {
  const cnv = createCanvas(640, 640);

  let button = createButton('submit').mousePressed(submitPic);
  button.position(10, 10)

  capture = createCapture(VIDEO);
  capture.size(thumbWidth, thumbHeight);
  capture.position(10, 50)


  // see https://github.com/danielvarga/p5js-networking
  // for a server setup guide
  const path = "https://" + ngrok + ".ngrok.io";

  socket = io.connect(path)

  socket.on('event', data => {
    receivedImage = createImg(data.image);
    receivedImage.position(posX, posY)
    posX += thumbWidth + 5
    if (posX + thumbWidth > windowWidth) {
      posX = 640 + 20
      posY += thumbHeight + 5
    }

    // ...or we could hide it from the DOM:
    // receivedImage.hide();
  })
}

function draw() {
  if (receivedImage) {
    image(receivedImage, 0, 40, 640, 480 + 40);
  }
}

function submitPic() {

  // load pixels of video capture onto a canvas
  capture.loadPixels();

  // create a base64-encoded version of the pixels on the video's canvas
  let imageString = capture.canvas.toDataURL();

  socket.emit('event', {
    image: imageString
  })
}
