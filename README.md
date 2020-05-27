# p5js-networking

# Install and run

```
npm install

node server

open http://localhost           # shooter
open http://localhost/draw.html # paint
open http://localhost/chat.html # sending webcam photos to each other
open http://localhost/zoom.html # webcam streaming
```

# Let's expose it on the net

Register to https://ngrok.com/. Download ngrok client.

```
./ngrok authtoken <<STRING FOUND AT https://dashboard.ngrok.com/get-started/setup>>

# while the node server is running:
./ngrok http http://localhost:80

open http://<<WHATEVER NGROK SAYS>>.ngrok.io
```

Networking code taken from https://github.com/TannerGabriel/DrawingApp
