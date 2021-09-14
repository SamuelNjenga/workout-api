const db = require('../db/models/index')

exports.createRole = async data => {
  return db.Role.create(data)
}

exports.updateRole = async (data, root) => {
  return db.Role.update(data, root)
}

exports.getRoles = async () => {
  return db.Role.findAll()
}

exports.deleteRole = async data => {
  return db.Role.destroy(data)
}
