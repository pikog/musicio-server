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
        return this.engine.addPlayer(player.id)
    }

    /**
     * Remove a player from a room
     * @param {string} playerId ID of the player to remove
     */
    removePlayer(playerId)
    {
        delete this.players[playerId]
    }

    /**
     * Send positions to all players in a radius
     */
    sendPos()
    {
        for(const playerId in this.players)
        {
            const data = []
            const player = this.players[playerId]
            data.push({
                name: player.name,
                color: player.color,
                position: player.engineObject.position
            })
            for(const nearPlayer of player.getNearPlayers(900))
            {
                data.push({
                    name: nearPlayer.name,
                    color: nearPlayer.color,
                    position: nearPlayer.engineObject.position
                })
            }
            player.socket.emit('pos', data)
        }
    }

}

module.exports = Room