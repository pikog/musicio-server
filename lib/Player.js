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
    this.musicInfo = {instrument: 0}
    this.energy = 0
  }

  /**
   * Move the player in a direction
   * @param {Object} coords coordinates of the vector
   */
  move(coords)
  {
    Matter.Body.setVelocity(this.engineObject, {x: coords.x, y: coords.y})
  }

  /**
   * Set intrument of the player
   * @param {number} instrument id of the instrument
   */
  setInstrument(instrument)
  {
    this.musicInfo.instrument = instrument
  }

  /**
   * This player play a note of his intrument
   * @param {number} note id of the note
   */
  playNote(note)
  {
    this.room.aPlayerPlayNote(this, note)
  }

  /**
   * Get all players around the player
   * @param {number} radius radius of research
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

  /**
   * Change energy value of the player
   * @param {number} energy
   */
  changeEnergy(energy)
  {
    const oldFactor = 1 + 0.015 * this.energy
    this.energy = energy
    const factor = 1 + 0.015 * this.energy
    Matter.Body.scale(this.engineObject, factor/oldFactor, factor/oldFactor)
  }
}

module.exports = Player
