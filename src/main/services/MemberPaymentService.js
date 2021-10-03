const db = require('../db/models/index')

exports.createMemberPayment = async data => {
  return db.MemberPayment.create(data)
}

exports.updateMemberPayment = async (data, root) => {
  return db.MemberPayment.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalPayments, rows: payments } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalPayments / limit)

  return { totalPayments, payments, totalPages, currentPage }
}

exports.getMemberPayments = async () => {
  return db.MemberPayment.findAndCountAll({
    include: db.MemberRegistration
  })
}

exports.deleteMemberPayment = async data => {
  return db.MemberPayment.destroy(data)
}
