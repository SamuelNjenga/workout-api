const db = require('../db/models/index')

exports.createMemberRegistration = async data => {
  return db.MemberRegistration.create(data)
}

exports.updateMemberRegistration = async (data, root) => {
  return db.MemberRegistration.update(data, root)
}

exports.getMembers = async () => {
  return db.MemberRegistration.findAll()
}

exports.deleteMemberRegistration = async data => {
  return db.MemberRegistration.destroy(data)
}
