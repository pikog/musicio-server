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

  socket.on('move', (coords, energy = null) =>
  {
    if(socket.room)
    {
      const room = roomManager.rooms[socket.room]
      const player  = room.players[socket.id]
      player.move(coords)
      if(energy !== null)
      {
        player.changeEnergy(energy)
      }
    }
  })

  socket.on('setInstrument', (instrument) =>
  {
    if(socket.room)
    {
      const room = roomManager.rooms[socket.room]
      room.players[socket.id].setInstrument(instrument)
      console.log(chalk`{green.bold setInstrument >} {blue player ${socket.id} change instrument to ${instrument} in room ${socket.room}}`)
    }
  })

  socket.on('removeInstrument', (x, y) =>
  {
    if(socket.room)
    {
      const room = roomManager.rooms[socket.room]
      if(room.removeInstrument(x, y))
      {
        room.generateInstruments(1)
        console.log(chalk`{green.bold removeInstrument >} {blue player ${socket.id} removeInstrument at ${x} and ${y} in room ${socket.room}}`)
      }
    }
  })

  socket.on('playNote', (note) =>
  {
    if(socket.room)
    {
      const room = roomManager.rooms[socket.room]
      room.players[socket.id].playNote(note)
      console.log(chalk`{green.bold playNote >} {blue player ${socket.id} play the note ${note} in room ${socket.room}}`)
    }
  })
}

const onJoin = (socket, roomName, playerName, color) =>
{
  let room = roomManager.rooms[roomName]
  if(!room)
  {
    room = new Room(roomName)
    roomManager.addRoom(room)
    console.log(chalk`{green.bold onJoin >} {blue room ${roomName} created}`)
  }
  const player = new Player(playerName, color, room, socket)
  loopManager.startLoops()
  socket.room = roomName
  player.sendExistedInstrument()
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
    loopManager.killLoops()
  }
}

module.exports = {
  onConnection
}
