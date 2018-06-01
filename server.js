//Import classes
const connection = require('./lib/connection.js')

//Init express
const express = require('express')
const app = express()

//Init http server based on express
const http = require('http').Server(app)
const port = process.env.PORT || 8080;

//Start server
http.listen(port, () =>
{
  console.log(`Server started on port ${port}`)
})

//Init socket.io
const io = require('socket.io').listen(http)

//Active public folder
app.use('/', express.static(__dirname + '/public'))

//Socket Event listener
io.on('connection', (socket) =>
{
  connection.onConnection(socket)
})
