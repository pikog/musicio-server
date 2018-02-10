class Player
{
    constructor(name, room)
    {
        this.name = name
        this.room = room
        this.id = this.room.addPlayer(this)
        return this
    }
}

module.exports = Player