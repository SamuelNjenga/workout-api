const db = require('../db/models/index')

exports.createTrainerProfile = async data => {
  return db.TrainerProfile.create(data)
}

exports.updateTrainerProfile = async (data, root) => {
  return db.TrainerProfile.update(data, root)
}

exports.getTrainerProfiles = async () => {
  return db.TrainerProfile.findAll()
}

exports.deleteTrainerProfile = async data => {
  return db.TrainerProfile.destroy(data)
}
