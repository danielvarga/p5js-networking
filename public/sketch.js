let socket

const port = '80'

const num = 20
const cnt = 50

let points = []

function setup() {
  createCanvas(600, 600)
  socket = io.connect('http://localhost:' + port)

  socket.on('event', data => {
    fill(0, 0, 255)
    ellipse(data.x, data.y, 100, 100) 
  })
}


function draw() {
  fill(255, 0, 0)
  ellipse(mouseX, mouseY, 100, 100)

  if (frameCount % 1 == 0) {
    const data = {
        x: mouseX,
        y: mouseY
    }

    socket.emit('event', data)
  }
}
