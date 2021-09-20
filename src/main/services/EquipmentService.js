const db = require('../db/models/index')

exports.createEquipment = async data => {
  return db.Equipment.create(data)
}

exports.updateEquipment = async (data, root) => {
  return db.Equipment.update(data, root)
}

exports.getEquipment = async () => {
  return db.Equipment.findAll()
}

exports.deleteEquipment = async data => {
  return db.Equipment.destroy(data)
}
