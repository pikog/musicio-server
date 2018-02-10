//Import package
const express = require('express')
const Player = require('./Player.js')
const Room = require('./Room.js')

//init express
const app = express()

//Config express
const port = process.env.PORT || 8080;
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

//Start app
app.listen(port, () =>
{
    console.log(`Server started on port ${port}`)
})

const myRoom = new Room('test')
new Player('Jean', myRoom)
new Player('Paul', myRoom)
new Player('Uulzic', myRoom)