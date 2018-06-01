const Engine = require('./Engine.js')
const roomManager = require('./roomManager.js')
const loopManager = require('./loopManager.js')
const Instrument = require('./Instrument.js')

class Room
{
  constructor(name)
  {
    this.name = name
    this.players = {}
    this.size = {width: 500, height: 500}
    this.engine = new Engine({
      pointMin: {x: 0, y: 0},
      pointMax: {x: this.size.width, y: this.size.height},
      thickness: 50
    })
    this.instruments = []
    this.generateInstruments(2)
  }

  addPlayer(player)
  {
    this.players[player.id] = player
    return this.engine.addPlayer(player.id)
  }

  /**
   * Generate new instrument
   * @param {int} number number of instrument generated
   */
  generateInstruments(number)
  {
    for(let i = 0; i < number; i++)
    {
      const instrument = new Instrument(this.size.width, this.size.height)
      this.instruments.push(instrument)
      for(const playerId in this.players)
      {
        const player = this.players[playerId]
        player.socket.emit('newInstrument', instrument)
      }
    }
  }

  /**
   * Remove instrument
   * @param {int} x x pos of the instrument
   * @param {int} y y pos of the instrument
   */
  removeInstrument(x, y)
  {
    for(let i = 0; i < this.instruments.length; i++)
    {
      const instrument = this.instruments[i]
      if(instrument.x === x && instrument.y === y)
      {
        this.instruments.splice(i, 1)
        for(const playerId in this.players)
        {
          const player = this.players[playerId]
          player.socket.emit('instrumentRemoved', instrument)
        }
        return true
      }
    }
    return false
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
        position: player.engineObject.position,
        musicInfo: player.musicInfo
      })
      for(const nearPlayer of player.getNearPlayers(300))
      {
        data.push({
          id: nearPlayer.id,
          name: nearPlayer.name,
          color: nearPlayer.color,
          position: nearPlayer.engineObject.position,
          musicInfo: nearPlayer.musicInfo,
          energy: nearPlayer.energy
        })
      }
      player.socket.emit('updatePlayer', data)
    }
  }

  /**
   * Emit event to indicate a player play a note
   * @param {Player} player player who play the note
   * @param {number} note the note played
   */
  aPlayerPlayNote(player, note)
  {
    for(const nearPlayer of player.getNearPlayers(300))
    {
      const data = {
        id: player.id,
        note: note
      }
      nearPlayer.socket.emit('aPlayerPlayNote', data)
    }
  }
}

module.exports = Room
