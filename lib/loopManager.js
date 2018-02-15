const roomManager = require('./roomManager.js')
/**
 * Main loop of server
 */
let loop
//Main loop management functions

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
        loop = undefined
    }
}

module.exports = {
    loop,
    startLoop,
    killLoop
}