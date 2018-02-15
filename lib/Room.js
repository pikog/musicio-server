const Engine = require('./Engine.js')
const roomManager = require('./roomManager.js')
const loopManager = require('./loopManager.js')

class Room
{
    constructor(name)
    {
        this.name = name
        this.players = {}
        this.engine = new Engine({
            pointMin: {x: 0, y: 0},
            pointMax: {x: 500, y: 500},
            thickness: 50
        })
        return this
    }

    addPlayer(player)
    {
        this.players[player.id] = player
        return this.engine.addPlayer()
    }

    /**
     * Remove a player from a room
     * @param {string} playerId ID of the player to remove
     */
    removePlayer(playerId)
    {
        delete this.players[playerId]
    }

    sendPosToAll()
    {
        const data = []
        for(const player in this.players)
        {
            data.push({
                name: this.players[player].name,
                color: this.players[player].color,
                position: this.players[player].engineObject.position
            })
        }

        for(const player in this.players)
        {
            this.players[player].socket.emit('pos', data)
        }
    }

}

module.exports = Room