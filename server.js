// based on https://github.com/TannerGabriel/DrawingApp

const http = require('http')
const https = require('https')

const express = require('express')


const app = express()

// seems like this is only needed when editor.p5js.org serves the client
var cors = require('cors')
app.use(cors())


var httpServer = http.createServer(app)
var httpsServer = https.createServer(app)

app.use(express.static('public'))

const httpPort = '80'
const httpsPort = '443'

httpServer.on('listening', () => {
 console.log('http listening on port', httpPort)
})

httpsServer.on('listening', () => {
 console.log('https listening on port', httpsPort)
})

const httpIO = require('socket.io')(httpServer)

httpIO.sockets.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id)

    socket.on('event', (data) => {
        socket.broadcast.emit('event', data)
    })

    socket.on('disconnect', () => console.log('Client has disconnected'))
})


const httpsIO = require('socket.io')(httpsServer)

httpsIO.sockets.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id)

    socket.on('event', (data) => {
        socket.broadcast.emit('event', data)
    })

    socket.on('disconnect', () => console.log('Client has disconnected'))
})

httpServer.listen(httpPort)
httpsServer.listen(httpsPort)
