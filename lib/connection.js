//Import classes
const chalk = require('chalk')
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

    socket.on('move', (coords) =>
    {
        if(socket.room)
        {
            const room = roomManager.rooms[socket.room]
            room.players[socket.id].move(coords)
        }
    })

    socket.on('setInstrument', (instrument) =>
    {
        if(socket.room)
        {
            const room = roomManager.rooms[socket.room]
            room.players[socket.id].setInstrument(instrument)
            console.log(chalk`{green.bold setInstrument >} {blue room ${socket.id} change instrument to ${instrument} in ${socket.room}}`)
        }
    })

    socket.on('playNote', (note) =>
    {
        if(socket.room)
        {
            const room = roomManager.rooms[socket.room]
            room.players[socket.id].playNote(note)
            console.log(chalk`{green.bold playNote >} {blue room ${socket.id} play the note ${note} in ${socket.room}}`)
        }
    })
}

const onJoin = (socket, roomName, playerName, color) =>
{
    let room = roomManager.rooms[roomName]
    if(!room)
    {
        room = new Room(roomName)
        roomManager.rooms[roomName] = room
        console.log(chalk`{green.bold onJoin >} {blue room ${roomName} created}`)
    }
    new Player(playerName, color, room, socket)
    loopManager.startLoop()
    socket.room = roomName
    console.log(chalk`{green.bold onJoin >} {blue ${socket.id}(${playerName}) join room ${roomName}}`)
}

const onDisconnect = (socket, roomName) =>
{
    const room = roomManager.rooms[roomName]
    room.removePlayer(socket.id)
    console.log(chalk`{green.bold onDisconnect >} {blue ${socket.id} disconnect room ${roomName}}`)
    if(Object.keys(room.players).length === 0)
    {
        roomManager.deleteRoom(room)
        console.log(chalk`{green.bold onDisconnect >} {blue room ${roomName} deleted}`)
        loopManager.killLoop()
    }
}

module.exports = {
    onConnection
}