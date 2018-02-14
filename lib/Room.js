const Engine = require('./Engine.js')
const globals = require('./globals.js')
const loop = require('./loop.js')

class Room
{
    constructor(name)
    {
        this.name = name
        this.players = []
        this.engine = new Engine({
            pointMin: {x: 0, y: 0},
            pointMax: {x: 500, y: 500},
            thickness: 50
        })
        return this
    }

    addPlayer(player)
    {
        this.players.push(player)
        return this.engine.addPlayer()
    }

    sendPosToAll()
    {
        const data = []
        for(const player of this.players)
        {
            data.push({
                name: player.name,
                color: player.color,
                position: player.engineObject.position
            })
        }

        for(const player of this.players)
        {
            player.socket.emit('pos', data)
        }
    }


    /**
     * Kill this room
     */
    killMe()
    {
        this.engine.stopEngine()
        const index = globals.rooms.findIndex((elem) => { return elem === this })
        globals.rooms.splice(index, 1)
        this = undefined
        loop.killLoop()
        console.log(globals.rooms)
    }

}

module.exports = Room