const Engine = require('./Engine.js')
const globals = require('./globals.js')
const loop = require('./loop.js')

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


    /**
     * Kill this room
     */
    killMe()
    {
        this.engine.stopEngine()
        delete globals.rooms[this.name]
        loop.killLoop()
        console.log(globals.rooms)
    }

}

module.exports = Room