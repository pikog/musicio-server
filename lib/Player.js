const Matter = require('matter-js')

class Player
{
    constructor(name, color, room, socket)
    {
        this.name = name
        this.id = socket.id
        this.color = color
        this.room = room
        this.socket = socket
        this.engineObject = this.room.addPlayer(this)
        return this
    }

    moveBall(coords)
    {
        Matter.Body.setVelocity(this.engineObject, {x: coords.x, y: coords.y})
    }
}

module.exports = Player