const trainingSessionService = require('../services/TrainingSessionService')
const memberBookingService = require('../services/MemberBookingService')
const ReqValidator = require('../utils/validator')
const db = require('../db/models')

const { Op } = require('sequelize')
const moment = require('moment')

exports.createTrainingSession = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      serviceId: 'required|integer',
      maxMembers: 'required|integer',
      startTime: 'required',
      endTime: 'required',
      roomId: 'required|integer',
      trainerId: 'required|integer',
      image: 'string'
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
      trainerId: req.body.trainerId,
      image: req.body.image
    }
    console.log(data.startTime)
    await trainingSessionService.createTrainingSession(data)
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.error('Err', err.message)
    next({ message: err.message })
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
      trainerId: 'required|integer',
      image: 'string'
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
      trainerId: req.body.trainerId,
      image: req.body.image
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

exports.updateSession = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = memberBookingService.getPagination(page, size)

  try {
    const data = {
      userId: req.body.userId,
      newSession: req.body.newSession,
      quantity: req.body.quantity
    }

    await trainingSessionService.updateSession(
      data.userId,
      data.newSession,
      data.quantity
    )

    const response = await db.MemberBooking.findAll({
      where: {
        memberId: data.userId
      }
    })

    //res.status(200).json(response)

    const dataOne = await db.MemberBooking.findAndCountAll({
      where: {
        memberId: data.userId
      },
      order: [['id', 'DESC']],
      limit,
      include: [
        {
          model: db.TrainingSession,
          include: [db.ServiceType]
        }
      ],
      offset
    })

    const response2 = memberBookingService.getPagingData(dataOne, page, limit)
    res.status(200).json({ response, response2 })
  } catch (err) {
    res.status(400).json({ message: err.message })
    next(err)
  }
}

exports.endSession = async (req, res, next) => {
  try {
    const data = {
      sessionId: req.body.sessionId
    }
    const response = await trainingSessionService.endSession(data.sessionId)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.postponeSession = async (req, res, next) => {
  try {
    const data = {
      sessionId: req.body.sessionId,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      roomId: req.body.roomId,
      trainerId: req.body.trainerId
    }
    const response = await trainingSessionService.postponeSession(
      data.sessionId,
      data.startTime,
      data.endTime,
      data.roomId,
      data.trainerId
    )
    res.status(200).json(response)
  } catch (err) {
    res.status(500).json({ message: err.message })
    console.error('Err', err.message)
    next({ message: err.message })
  }
}

exports.bookingCheck = async (req, res, next) => {
  try {
    const data = {
      id: req.body.id,
      memberId: req.body.memberId
    }
    const response = await trainingSessionService.bookingCheck(
      data.id,
      data.memberId
    )
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.cancelSession = async (req, res, next) => {
  try {
    const data = {
      sessionId: req.body.sessionId
    }
    const response = await trainingSessionService.cancelSession(data.sessionId)
    res.status(200).json(response)
  } catch (err) {
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
  const { page, size } = req.query
  const { limit, offset } = trainingSessionService.getPagination(page, size)
  db.TrainingSession.findAndCountAll({
    limit,
    where: {
      startTime: {
        [Op.gte]: moment()
      }
    },
    offset
  })
    .then(data => {
      const response = trainingSessionService.getPagingData(data, page, limit)
      res.status(200).json(response)
    })
    .catch(err => {
      res.status(500).send({
        message:
          'Server error occurred while retrieving the wishlists.Try again.'
      })
      next(err)
    })
}

exports.getAdminTrainingSessions = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = trainingSessionService.getPagination(page, size)

  try {
    const sessions = await trainingSessionService.getTrainingSessions()
    const response = trainingSessionService.getPagingData(sessions, page, limit)
    res.status(200).json(response)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}

exports.totalSessionsPerRoom = async (req, res, next) => {
  try {
    const {
      totalSessions,
      totalNumber
    } = await trainingSessionService.totalSessionsPerRoom()
    res.status(200).json({ totalSessions, totalNumber })
  } catch (err) {
    next(err)
  }
}
