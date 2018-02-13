let loop

const startLoop = (rooms) =>
{
    killLoop()
    loop = setInterval(() => 
    {
        for(const room of rooms)
        {
            room.sendPosToAll()
        }
    }, 20)
}

const killLoop = () =>
{
    if(loop)
    {
        clearInterval(loop)
        loop = undefined
    }
}

module.exports = {
    startLoop,
    killLoop
}