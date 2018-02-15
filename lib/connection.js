//Import classes
const Player = require('./Player.js')
const Room = require('./Room.js')
const roomManager = require('./roomManager.js')
const loopManager = require('./loopManager.js')

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
    let room = roomManager.rooms[roomName]
    if(!room)
    {
        room = new Room(roomName)
        roomManager.rooms[roomName] = room
    }
    new Player(playerName, color, room, socket)
    loopManager.startLoop()
}

module.exports = {
    onConnection
}