const fejmeret = 100
const szemmeret = 15
const fulhossz = 50

let manok = []

function verpaca(hely) {
  const num = 50
  const pacaMeret = 150
  let points = []
  for (var i = 0; i < num; i++) {
    const theta = 2 * PI / num * i
    const r = noise(hely.x / 200, hely.y / 200, i)
    const x = cos(theta) * r
    const y = sin(theta) * r
    points[i] = createVector(x, y)
  }
  fill(255, 0, 0)
  noStroke()
  beginShape()
  for (var ii = 0; ii < num + 3; ii++) {
    const i = ii % num
    curveVertex(points[i].x * pacaMeret + hely.x, points[i].y * pacaMeret + hely.y);
  }
  endShape()
}


class Mano {
  constructor() {
    this.szin = color(random(128, 255), random(128, 255), random(128, 255))
    this.hely = createVector(0, 0)
    this.irany = 1
    this.elozoHely = createVector(0, 0)
    this.golyoHely = createVector(0, 0)
    this.golyoIrany = 0
    this.pontszam = 0
    this.nev = "mano" + int(random(10000, 99999))
  }

  testRajzolas() {
    fill(this.szin)
    stroke(0)
    const x = this.hely.x
    const y = this.hely.y
    ellipse(x - fejmeret / 4, y - fejmeret / 2, 2 * szemmeret, fulhossz)
    ellipse(x + fejmeret / 4, y - fejmeret / 2, 2 * szemmeret, fulhossz)
    ellipse(x, y, fejmeret, fejmeret)

    fill(0)
    if (this.irany == 1) {
      ellipse(x, y - fejmeret / 6, szemmeret, szemmeret)
      ellipse(x + fejmeret / 4, y - fejmeret / 6, szemmeret, szemmeret)
    } else {
      ellipse(x - fejmeret / 4, y - fejmeret / 6, szemmeret, szemmeret)
      ellipse(x, y - fejmeret / 6, szemmeret, szemmeret)
    }

    noStroke()
    fill(100, 50, 50)
    if (this.irany == 1) {
      rect(x + fejmeret / 2, y + fejmeret / 2, 20, 30, 5)
      rect(x + fejmeret / 2, y + fejmeret / 2, 50, 20, 5)
    } else {
      rect(x - fejmeret / 2, y + fejmeret / 2, 20, 30, 5)
      rect(x - fejmeret + 20, y + fejmeret / 2, 50, 20, 5)
    }
  }

  golyoRajzolas() {
    const golyomeret = 20
    if (this.golyoIrany != 0) {
      noStroke()
      for (let i = 10; i >= 0; --i) {
        fill(0, 0, 0, 255 - i * 25)
        ellipse(this.golyoHely.x - i * 6 * this.golyoIrany, this.golyoHely.y, golyomeret, golyomeret)
      }
    }
  }

  testMozgatas(ujHely) {
    this.hely.x = ujHely.x
    this.hely.y = ujHely.y

    if (abs(this.hely.x - this.elozoHely.x) <= 1) {
      // no-op
    } else if (this.hely.x < this.elozoHely.x) {
      this.irany = -1
    } else {
      this.irany = +1
    }

    this.elozoHely.x = this.hely.x
    this.elozoHely.y = this.hely.y
  }

  golyoMozgatas() {
    if (this.golyoIrany != 0) {
      this.golyoHely.x += 6 * this.golyoIrany
      if ((this.golyoHely.x > width) || (this.golyoHely.x < 0)) {
        this.golyoIrany = 0
      }
    }
  }

  rajzolas() {
    this.golyoRajzolas()    
    this.testRajzolas()
  }

  mozgatas(ujHely) {
    this.golyoMozgatas()
    this.testMozgatas(ujHely)
  }

  loves() {
    this.golyoIrany = this.irany
    this.golyoHely.x = this.hely.x + 100 * this.irany
    this.golyoHely.y = this.hely.y + 60
  }
}


function setup() {
  createCanvas(768, 768);
  manok = [new Mano(), new Mano()]
}


function eltalaltaE(tettes, aldozat) {
  if (tettes.golyoIrany != 0) {
    let tavolsag = dist(aldozat.hely.x, aldozat.hely.y, tettes.golyoHely.x, tettes.golyoHely.y)
    if (tavolsag < fejmeret / 2) {
      verpaca(aldozat.hely)
      tettes.pontszam += 1
    }
  }
}

function eltalaltEValakiValakit(manok) {
  for (let tettes=0; tettes<manok.length; ++tettes) {
    for (let aldozat=0; aldozat<manok.length; ++aldozat) {
      eltalaltaE(manok[tettes], manok[aldozat])
    }
  }
}

function mousePressed() {
  manok[0].loves()
}


function keyReleased() {
  if (key == ' ') {
    manok[1].loves()
  }
}


function eredmenyek(manok) {
  textSize(32)
  const hezag = (width - 100) / manok.length
  for (let i=0; i<manok.length; ++i) {
    fill(manok[i].szin)
    text(manok[i].pontszam, 50 + i * hezag, 30)
  }
}


function draw() {
  background(255)

  emberMano = manok[0]
  robotMano = manok[1]

  emberMano.mozgatas(createVector(mouseX, mouseY))

  let robotX = 3 * width / 4 + width / 4 * sin(frameCount / 50)
  let robotY = height / 2 + height / 2 * sin(frameCount / 55)
  robotMano.mozgatas(createVector(robotX, robotY))
   
  emberMano.rajzolas()
  robotMano.rajzolas()

  eltalaltEValakiValakit(manok)

  eredmenyek(manok)
}