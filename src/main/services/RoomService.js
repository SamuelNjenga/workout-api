const db = require('../db/models/index')

exports.createRoom = async data => {
  return db.Room.create(data)
}

exports.updateRoom = async (data, root) => {
  return db.Room.update(data, root)
}

exports.getRooms = async () => {
  return db.Room.findAll()
}

exports.deleteRoom = async data => {
  return db.Room.destroy(data)
}
