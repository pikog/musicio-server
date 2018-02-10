class Room
{
    constructor(name)
    {
        this.name = name
        this.players = []
        this.idVar = 0
        return this
    }

    addPlayer(player)
    {
        this.players.push(player)
        return this.idVar++
    }

}

module.exports = Room