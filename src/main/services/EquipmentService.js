const db = require('../db/models/index')
const { sequelize } = require('../db/models/index')

exports.createEquipment = async data => {
  return db.Equipment.create(data)
}

exports.updateEquipment = async (data, root) => {
  return db.Equipment.update(data, root)
}

exports.getEquipment = async () => {
  return db.Equipment.findAndCountAll()
}

exports.deleteEquipment = async data => {
  return db.Equipment.destroy(data)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalEquipments, rows: equipments } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalEquipments / limit)

  return { totalEquipments, equipments, totalPages, currentPage }
}

exports.diactivateEquipment = async equipmentId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const equipment = await db.Equipment.findByPk(equipmentId, {
      transaction
    })
    if (!equipment) {
      throw new Error('This equipment does not exist')
    }
    await equipment.update(
      {
        available: 0
      },
      { transaction }
    )

    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.activateEquipment = async equipmentId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const equipment = await db.Equipment.findByPk(equipmentId, {
      transaction
    })
    if (!equipment) {
      throw new Error('This equipment does not exist')
    }
    await equipment.update(
      {
        available: 1
      },
      { transaction }
    )

    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

