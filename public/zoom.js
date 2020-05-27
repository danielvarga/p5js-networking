
deploy = 'heroku'

const ngrok = '21105165'
const heroku = 'vargaabel'


const bitmapSize = 60

let capture

let pixels = new Array(bitmapSize * bitmapSize * 3).fill(0)

let id

let cnv

function centerCanvas() {
  var x = (windowWidth - width) / 2
  var y = (windowHeight - height) / 2
  cnv.position(x, y)
}

function windowResized() {
  centerCanvas();
}


function setup() {
  cnv = createCanvas(768, 768)
  centerCanvas()

  // specify multiple formats for different browsers
  capture = createCapture(VIDEO)
  capture.size(640, 480)
  capture.hide()
  noStroke()
  fill(0)

  id = round(random(10000))

  let url
  if (deploy == 'heroku') {
    url = 'https://' + heroku + '.herokuapp.com'
  } else {
    url = 'https://' + ngrok + '.ngrok.io'
  socket = io.connect(url)

  socket.on('event', data => {
    const img = render(data.pixels)
    image(img, data.x, data.y, 200, 200)
  })
}

function render(pixels) {
  let img = createImage(bitmapSize, bitmapSize)
  img.loadPixels()
  for (let i = 0; i < bitmapSize; i++) {
    for (let j = 0; j < bitmapSize; j++) {
      if (dist(i, j, bitmapSize/2, bitmapSize/2) > bitmapSize/2) {
        img.set(i, j, color(0, 0, 0, 0))
        continue
      }
      const pos = (j*bitmapSize + i) * 3
      const c = color(pixels[pos], pixels[pos + 1], pixels[pos + 2])
      img.set(i, j, c)
    }
  }
  img.updatePixels()
  return img
}

function draw() {
  capture.loadPixels()
  const stepSize = 10
  // console.log(frameRate())
  const frameSize = capture.height * 0.6

  for (let yi = 0; yi < bitmapSize; yi++) {
    for (let xi = 0; xi < bitmapSize; xi++) {
      const y = round(frameSize * ((1.0 * yi / bitmapSize) - 0.5) + capture.height / 2)
      const x = round(frameSize * ((1.0 * xi / bitmapSize) - 0.5) + capture.width / 2)
      const i = y * capture.width + x
      const i_out = yi * bitmapSize + xi
      pixels[i_out * 3] = capture.pixels[i * 4]
      pixels[i_out * 3 + 1] = capture.pixels[i * 4 + 1]
      pixels[i_out * 3 + 2] = capture.pixels[i * 4 + 2]
      fill(0 + capture.pixels[i * 4], 0 + capture.pixels[i * 4 + 1], 0 + capture.pixels[i * 4 + 2])
      // rect(x, y, stepSize, stepSize)
    }
  }
  const img = render(pixels)
  image(img, mouseX, mouseY, 200, 200)
  if (frameCount % 10 === 0) {
    socket.emit('event', {pixels: pixels, id: id, x: mouseX, y: mouseY})
  }
}
