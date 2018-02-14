const globals = require('./globals.js')

//Main loop management functions

/** 
 * Start main loop used for send event every 20 ms
*/
const startLoop = () =>
{
    if(!globals.loop)
    {
        globals.loop = setInterval(() => 
        {
            for(const room in globals.rooms)
            {
                globals.rooms[room].sendPosToAll()
            }
        }, 20)
    }
}

/**
 * Kill main loop
 */
const killLoop = () =>
{
    if(globals.loop && Object.keys(globals.rooms) === 0)
    {
        clearInterval(globals.loop)
        globals.loop = undefined
    }
}

module.exports = {
    startLoop,
    killLoop
}