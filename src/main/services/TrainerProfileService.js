const db = require('../db/models/index')

exports.createTrainerProfile = async data => {
  return db.TrainerProfile.create(data)
}

exports.updateTrainerProfile = async (data, root) => {
  return db.TrainerProfile.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalTrainerProfiles, rows: trainerProfiles } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalTrainerProfiles / limit)

  return { totalTrainerProfiles, trainerProfiles, totalPages, currentPage }
}

exports.getTrainerProfiles = async () => {
  return db.TrainerProfile.findAndCountAll()
}

exports.deleteTrainerProfile = async data => {
  return db.TrainerProfile.destroy(data)
}
