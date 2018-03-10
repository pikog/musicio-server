const chalk = require('chalk')
const roomManager = require('./roomManager.js')
/**
 * Main loop of server
 */
let loop = null
//Main loop management functions

/**
 * Return main loop
 */
const getLoop = () =>
{
    return loop
}

/** 
 * Start main loop used for send event every 20 ms
*/
const startLoop = () =>
{
    if(!loop)
    {
        loop = setInterval(() => 
        {
            for(const room in roomManager.rooms)
            {
                roomManager.rooms[room].sendPosToAll()
            }
        }, 20)
        console.log(chalk`{green.bold startLoop >} {blue main loop started}`)
    }
}

/**
 * Kill main loop
 */
const killLoop = () =>
{
    if(loop && roomManager.getLength() === 0)
    {
        clearInterval(loop)
        loop = null
        console.log(chalk`{green.bold killLoop >} {blue main loop deleted}`)
    }
}

module.exports = {
    getLoop,
    startLoop,
    killLoop
}