const db = require('../db/models/index')

exports.createServiceType = async data => {
  return db.ServiceType.create(data)
}

exports.updateServiceType = async (data, root) => {
  return db.ServiceType.update(data, root)
}

exports.getServiceTypes = async () => {
  return db.ServiceType.findAll()
}

exports.deleteServiceType = async data => {
  return db.ServiceType.destroy(data)
}
