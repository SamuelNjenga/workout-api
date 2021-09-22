const db = require('../db/models/index')

exports.createTrainingSession = async data => {
  return db.TrainingSession.create(data)
}

exports.updateTrainingSession = async (data, root) => {
  return db.TrainingSession.update(data, root)
}

exports.getTrainingSessions = async () => {
  return db.TrainingSession.findAll()
}

exports.deleteTrainingSession = async data => {
  return db.TrainingSession.destroy(data)
}
