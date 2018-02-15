/**
 * Rooms opened on server
 */
const rooms = {}

/**
 * Kill this room
 * @param {Room} roomName name of the room to delete
 */
const deleteRoom = (room) =>
{
    room.engine.stopEngine()
    delete rooms[room.name]
}


/**
 * Return number of rooms opened
 */
const getLength = () =>
{
    return Object.keys(rooms)
}

module.exports = {
    rooms,
    deleteRoom,
    getLength
}