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

//Config express
app.set('view engine', 'hbs')

//Active public folder
app.use('/static', express.static(__dirname + '/public'))

//Go to a specific room
app.get('/rooms/:room', (req, res) =>
{
    res.render('index.hbs', {room: req.params.room})
})

//Default route redirect to a random room
app.use((req, res, next) =>
{
    res.redirect(`/rooms/${Math.floor(Math.random()*100)}`)
})

//Socket Event listener
const rooms = []

io.on('connection', (socket) =>
{
    connection.onConnection(socket, rooms)
})