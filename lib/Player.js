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
}

module.exports = Player