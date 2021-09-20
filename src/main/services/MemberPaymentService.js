const db = require('../db/models/index')

exports.createMemberPayment = async data => {
  return db.MemberPayment.create(data)
}

exports.updateMemberPayment = async (data, root) => {
  return db.MemberPayment.update(data, root)
}

exports.getMemberPayments = async () => {
  return db.MemberPayment.findAll()
}

exports.deleteMemberPayment = async data => {
  return db.MemberPayment.destroy(data)
}
