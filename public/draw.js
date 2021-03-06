let socket

const ngrok = '21105165'
const port = '80'

const num = 20
const cnt = 50

let points = []

function setup() {
  createCanvas(256 * 3, 256 * 3)
  socket = io.connect('https://' + ngrok + ".ngrok.io")

  socket.on('event', data => {
    fill(255, data.x / 3, data.y / 3)
    ellipse(data.x, data.y, 30, 30)
  })
}


function draw() {
  fill(mouseY / 3, mouseX / 3, 255)
  ellipse(mouseX, mouseY, 30, 30)

  if (frameCount % 1 == 0) {
    const data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('event', data)
  }
}
