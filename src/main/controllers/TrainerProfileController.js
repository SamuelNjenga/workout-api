const trainerProfileService = require('../services/TrainerProfileService')
const ReqValidator = require('../utils/validator')

exports.createTrainerProfile = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      userId: 'required|integer',
      specialization: 'string'
    })
    if (!valid) return
    const data = {
      userId: req.body.userId,
      specialization: req.body.specialization
    }
    await trainerProfileService.createTrainerProfile(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateTrainerProfile = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      userId: 'required|integer',
      specialization: 'string'
    })
    if (!valid) return
    const data = {
      userId: req.body.userId,
      specialization: req.body.specialization
    }

    const trainerId = req.params.id
    await trainerProfileService.updateTrainerProfile(data, {
      where: {
        id: trainerId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteTrainerProfile = async (req, res, next) => {
  try {
    const trainerProfileId = req.params.id
    await trainerProfileService.deleteTrainerProfile({
      where: {
        id: trainerProfileId
      }
    })
    res.status(200).json({
      data: null,
      message: `TrainerProfile ${trainerProfileId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getTrainers = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = trainerProfileService.getPagination(page, size)

  try {
    const trainers = await trainerProfileService.getTrainerProfiles()
    const updatedTrainers = trainerProfileService.getPagingData(
      trainers,
      page,
      limit
    )
    res.status(200).json(updatedTrainers)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
