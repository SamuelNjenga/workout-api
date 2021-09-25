const db = require('../db/models/index')

exports.createMemberBooking = async data => {
  return db.MemberBooking.create(data)
}

exports.updateMemberBooking = async (data, root) => {
  return db.MemberBooking.update(data, root)
}

exports.getMemberBookings = async () => {
  return db.MemberBooking.findAll()
}

exports.deleteMemberBooking = async data => {
  return db.MemberBooking.destroy(data)
}
