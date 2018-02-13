class Player
{
    constructor(name, color, room, socket)
    {
        this.name = name
        this.color = color
        this.room = room
        this.socket = socket
        this.engineObject = this.room.addPlayer(this)
        return this
    }
}

module.exports = Player