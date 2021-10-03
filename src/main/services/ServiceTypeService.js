const db = require('../db/models/index')

exports.createServiceType = async data => {
  return db.ServiceType.create(data)
}

exports.updateServiceType = async (data, root) => {
  return db.ServiceType.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalServiceTypes, rows: serviceTypes } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalServiceTypes / limit)

  return { totalServiceTypes, serviceTypes, totalPages, currentPage }
}

exports.getServiceTypes = async () => {
  return db.ServiceType.findAndCountAll()
}

exports.deleteServiceType = async data => {
  return db.ServiceType.destroy(data)
}
