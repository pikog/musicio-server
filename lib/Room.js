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
