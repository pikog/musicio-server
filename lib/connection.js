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

    socket.on('disconnect', () =>
    {
        if(socket.room) 
        {
            onDisconnect(socket, socket.room)
        }
    })

    socket.on('sendBall', (coords) =>
    {
        const room = roomManager.rooms[socket.room]
        room.players[socket.id].moveBall(coords)
    })
}

const onJoin = (socket, roomName, playerName, color) =>
{
    console.log(`${socket.id} join room ${roomName}`)
    let room = roomManager.rooms[roomName]
    if(!room)
    {
        room = new Room(roomName)
        roomManager.rooms[roomName] = room
    }
    new Player(playerName, color, room, socket)
    loopManager.startLoop()
    socket.room = roomName
}

const onDisconnect = (socket, roomName) =>
{
    console.log(`${socket.id} disconnect room ${roomName}`)
    const room = roomManager.rooms[roomName]
    room.removePlayer(socket.id)
    if(Object.keys(room.players).length === 0)
    {
        roomManager.deleteRoom(room)
        loopManager.killLoop()
        console.log(`Room ${roomName} deleted`)
    }
}

module.exports = {
    onConnection
}