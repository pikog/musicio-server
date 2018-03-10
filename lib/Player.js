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

    /**
     * Get all players around the player
     * @param {number=} radius radius of research
     * @returns {Array.<Players>} return array of players around the player
    */
    getNearPlayers(radius = 50)
    {
        const nearPlayers = []
        for(const otherPlayerId in this.room.players)
        {
            if(otherPlayerId != this.id)
            {
                const playerPos = this.engineObject.position
                const otherPlayer = this.room.players[otherPlayerId]
                const otherPlayerPos = otherPlayer.engineObject.position
                if(Math.pow(otherPlayerPos.x - playerPos.x, 2) + Math.pow(otherPlayerPos.y - playerPos.y, 2) < Math.pow(radius, 2))
                {
                    nearPlayers.push(otherPlayer)
                }
            }
        }
        return nearPlayers
    }
}

module.exports = Player