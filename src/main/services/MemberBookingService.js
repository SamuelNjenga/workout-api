const db = require('../db/models/index')

exports.createMemberBooking = async data => {
  return db.MemberBooking.create(data)
}

exports.updateMemberBooking = async (data, root) => {
  return db.MemberBooking.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalMemberBookings, rows: bookings } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalMemberBookings / limit)

  return { totalMemberBookings, bookings, totalPages, currentPage }
}

exports.getMemberBookings = async () => {
  return db.MemberBooking.findAndCountAll()
}

exports.deleteMemberBooking = async data => {
  return db.MemberBooking.destroy(data)
}
