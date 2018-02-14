//Import classes
const Player = require('./Player.js')
const Room = require('./Room.js')
const globals = require('./globals.js')
const loop = require('./loop.js')

const onConnection = (socket) =>
{
    socket.on('join', (roomName, playerName, color) =>
    {
        onJoin(socket, roomName, playerName, color)
    })

    // socket.on('sendBall', (elem) =>
    // {
    //     if(elem.id >= 0 && elem.id < myRoom.players.length)
    //     {
    //         Matter.Body.setVelocity(myRoom.players[elem.id].engineObject, {x: elem.x, y: elem.y})
    //     }
    // })
}

const onJoin = (socket, roomName, playerName, color) =>
{
    console.log(socket.id)
    let room = globals.rooms.find((elem) => { return elem.name === roomName })
    if(!room)
    {
        room = new Room(roomName)
        globals.rooms.push(room)

    }
    new Player(playerName, color, room, socket)
    loop.startLoop()
}

module.exports = {
    onConnection
}