const globals = require('./globals.js')

//Main loop management functions

const startLoop = () =>
{
    killLoop()
    globals.loop = setInterval(() => 
    {
        for(const room of globals.rooms)
        {
            room.sendPosToAll()
        }
    }, 20)
}

const killLoop = () =>
{
    if(globals.loop)
    {
        clearInterval(globals.loop)
        globals.loop = undefined
    }
}

module.exports = {
    startLoop,
    killLoop
}