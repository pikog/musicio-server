//Import classes
const Player = require('./Player.js')
const Room = require('./Room.js')

const onConnection = (socket, rooms) =>
{
    socket.on('join', (roomName, playerName, color) =>
    {
        onJoin(socket, rooms, roomName, playerName, color)
    })

    // socket.on('sendBall', (elem) =>
    // {
    //     if(elem.id >= 0 && elem.id < myRoom.players.length)
    //     {
    //         Matter.Body.setVelocity(myRoom.players[elem.id].engineObject, {x: elem.x, y: elem.y})
    //     }
    // })
}

const onJoin = (socket, rooms, roomName, playerName, color) =>
{
    console.log(socket.id)
    let room = rooms.find((elem) => { return elem.name === roomName })
    if(!room)
    {
        room = new Room(roomName)
        rooms.push(room)
    }
    new Player(playerName, color, room, socket)
    if(room.players.length <= 1)
    {
        room.loopSendPos()
    }
}

module.exports = {
    onConnection
}