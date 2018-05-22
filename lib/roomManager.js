/**
 * Rooms opened on server
 */
const rooms = {}

/**
 * Add a room
 * @param {Room} room room to add
 */
const addRoom = (room) =>
{
  rooms[room.name] = room
}

/**
 * Kill this room
 * @param {Room} room room to delete
 */
const deleteRoom = (room) =>
{
  delete rooms[room.name]
}


/**
 * Return number of rooms opened
 * @returns {int} number of rooms opened
 */
const getLength = () =>
{
  return Object.keys(rooms).length
}

module.exports = {
  rooms,
  addRoom,
  deleteRoom,
  getLength
}
