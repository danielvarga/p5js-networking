// based on https://github.com/TannerGabriel/DrawingApp

const http = require('http')
const express = require('express')

const app = express()
app.use(express.static('public'))

port = '80'

app.set('port', port)

const server = http.createServer(app)
server.on('listening', () => {
 console.log('Listening on port', port)
})

const io = require('socket.io')(server)

io.sockets.on('connection', (socket) => {
    console.log('Client connected: ' + socket.id)

    socket.on('event', (data) => {
        socket.broadcast.emit('event', data)
    })

    socket.on('disconnect', () => console.log('Client has disconnected'))
})

server.listen(port)
