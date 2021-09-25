const trainingSessionService = require('../services/TrainingSessionService')
const ReqValidator = require('../utils/validator')

exports.createTrainingSession = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      serviceId: 'required|integer',
      maxMembers: 'required|integer',
      membersSoFar: 'required|integer',
      startTime: 'required',
      endTime: 'required',
      roomId: 'required|integer',
      trainerId: 'required|integer'
    })
    if (!valid) return
    const data = {
      serviceId: req.body.serviceId,
      maxMembers: req.body.maxMembers,
      membersSoFar: req.body.membersSoFar,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      roomId: req.body.roomId,
      active: req.body.active,
      trainerId: req.body.trainerId
    }
    await trainingSessionService.createTrainingSession(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateTrainingSession = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      serviceId: 'required|integer',
      maxMembers: 'required|integer',
      membersSoFar: 'required|integer',
      startTime: 'required',
      endTime: 'required',
      roomId: 'required|integer',
      trainerId: 'required|integer'
    })
    if (!valid) return
    const data = {
      serviceId: req.body.serviceId,
      maxMembers: req.body.maxMembers,
      membersSoFar: req.body.membersSoFar,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      roomId: req.body.roomId,
      active: req.body.active,
      trainerId: req.body.trainerId
    }

    const sessionId = req.params.id
    await trainingSessionService.updateTrainingSession(data, {
      where: {
        id: sessionId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteTrainingSession = async (req, res, next) => {
  try {
    const sessionId = req.params.id
    await trainingSessionService.deleteTrainingSession({
      where: {
        id: sessionId
      }
    })
    res.status(200).json({
      data: null,
      message: `TrainingSession ${sessionId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getTrainingSessions = async (req, res, next) => {
  try {
    const sessions = await trainingSessionService.getTrainingSessions()
    res.status(200).json(sessions)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}