const db = require('../db/models/index')

exports.createRoom = async data => {
  return db.Room.create(data)
}

exports.updateRoom = async (data, root) => {
  return db.Room.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalRooms, rows: rooms } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalRooms / limit)

  return { totalRooms, rooms, totalPages, currentPage }
}

exports.getRooms = async () => {
  return db.Room.findAndCountAll()
}

exports.deleteRoom = async data => {
  return db.Room.destroy(data)
}
