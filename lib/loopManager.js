const chalk = require('chalk')
const Matter = require('matter-js')
const roomManager = require('./roomManager.js')

/**
 * Movement loop of server
 */
let movementLoop = null

/**
 * Matter loop of server
 */
let matterLoop = null

/**
 * Start movement loop used for send event every 60 ms
*/
const startMovementLoop = () =>
{
  if(!movementLoop)
  {
    movementLoop = setInterval(() =>
    {
      for(const room in roomManager.rooms)
      {
          roomManager.rooms[room].sendPos()
      }
    }, 60)
    console.log(chalk`{green.bold startMovementLoop >} {blue movement loop started}`)
  }
}

/**
 * Start matter loop used for update matter engine
*/
const startMatterLoop = () =>
{
  if(!matterLoop)
  {
    matterLoop = setInterval(() =>
    {
      for(const room in roomManager.rooms)
      {
        Matter.Engine.update(roomManager.rooms[room].engine.matterEngine, 1000 / 60)
      }
    }, 1000 / 60)
    console.log(chalk`{green.bold startMatterLoop >} {blue matter loop started}`)
  }
}

/**
 * Start movement & matter loops
*/
const startLoops = () =>
{
  startMovementLoop()
  startMatterLoop()
}

/**
 * Kill movement & matter loops
 */
const killLoops = () =>
{
  if(roomManager.getLength() === 0)
  {
    if(movementLoop)
    {
      clearInterval(movementLoop)
      movementLoop = null
      console.log(chalk`{green.bold killLoops >} {blue movement loop deleted}`)
    }
    if(matterLoop)
    {
      clearInterval(matterLoop)
      matterLoop = null
      console.log(chalk`{green.bold killLoops >} {blue matter loop deleted}`)
    }
  }
}

module.exports = {
  startLoops,
  killLoops
}
