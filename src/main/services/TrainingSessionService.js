const db = require('../db/models/index')
const { sequelize } = require('../db/models/index')
const { Op } = require('sequelize')
const moment = require('moment')
const sendSms = require('../utils/twilio')
const memberRegistrationService = require('../services/MemberRegistrationService')

exports.createTrainingSession = async data => {
  const sessions = await db.TrainingSession.findAll({
    include: [{ model: db.Room }]
  })
  for (let i = 0; i < sessions.length; i++) {
    if (
      moment(sessions[i].startTime).format() === moment(data.startTime).format()
    ) {
      if (
        sessions[i].roomId === +data.roomId &&
        sessions[i].Room.available === false
      ) {
        throw new Error(
          `This room is in use between ${moment(sessions[i].startTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )} and ${moment(sessions[i].endTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}`
        )
      }
      if (sessions[i].trainerId === +data.trainerId) {
        throw new Error(
          `This trainer has a session between ${moment(
            sessions[i].startTime
          ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
            sessions[i].endTime
          ).format('MMMM Do YYYY, h:mm:ss a')}`
        )
      }
    }
    if (
      moment(data.endTime).format() >= moment(sessions[i].startTime).format() &&
      moment(data.endTime).format() <= moment(sessions[i].endTime).format()
    ) {
      if (
        sessions[i].roomId === +data.roomId &&
        sessions[i].Room.available === false
      ) {
        throw new Error(
          `This room is in use between ${moment(sessions[i].startTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )} and ${moment(sessions[i].endTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}`
        )
      }
      if (sessions[i].trainerId === +data.trainerId) {
        throw new Error(
          `This trainer has a session between ${moment(
            sessions[i].startTime
          ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
            sessions[i].endTime
          ).format('MMMM Do YYYY, h:mm:ss a')}`
        )
      }
    }
    if (
      moment(data.startTime).format() >=
        moment(sessions[i].startTime).format() &&
      moment(data.startTime).format() <= moment(sessions[i].endTime).format()
    ) {
      if (
        sessions[i].roomId === +data.roomId &&
        sessions[i].Room.available === false
      ) {
        throw new Error(
          `This room is in use between ${moment(sessions[i].startTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )} and ${moment(sessions[i].endTime).format(
            'MMMM Do YYYY, h:mm:ss a'
          )}`
        )
      }
      if (sessions[i].trainerId === +data.trainerId) {
        throw new Error(
          `This trainer has a session between ${moment(
            sessions[i].startTime
          ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
            sessions[i].endTime
          ).format('MMMM Do YYYY, h:mm:ss a')}`
        )
      }
    }
  }

  let room = await db.Room.findOne({
    where: { id: data.roomId }
  })
  if (room) {
    await room.update({
      available: false
    })
  }

  return db.TrainingSession.create(data)
}

exports.updateTrainingSession = async (data, root) => {
  return db.TrainingSession.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 8
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalSessions, rows: trainingSessions } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalSessions / limit)

  return { totalSessions, trainingSessions, totalPages, currentPage }
}

exports.getTrainingSessions = async () => {
  return db.TrainingSession.findAndCountAll()
}

exports.deleteTrainingSession = async data => {
  return db.TrainingSession.destroy(data)
}

exports.getSession = async userId => {
  return db.MemberBooking.findAndCountAll({
    where: {
      memberId: userId
    },
    include: [{ model: db.TrainingSession, include: [db.ServiceType] }]
  })
}

exports.updateSession = async (userId, newSession, quantity) => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const session = await db.TrainingSession.findByPk(newSession.id, {
      transaction
    })

    if (!session) {
      throw new Error('This session does not exist')
    }

    if (session.maxMembers - session.membersSoFar < quantity) {
      throw new Error('This session is already full.')
    }

    if (userId === null) {
      throw new Error('Register for membership to book session.')
    }

    const memberDetails = await memberRegistrationService.getMemberDetails(
      userId
    )
    
    if (memberDetails.status === 'Not Active') {
      throw new Error('Activate your account to book a session.')
    }

    // Get order
    const bookingData = {
      memberId: userId,
      sessionId: newSession.id
    }
    order = await db.MemberBooking.create(bookingData, { transaction })

    // Get training session
    let sessionItem = await db.TrainingSession.findOne({
      where: { id: newSession.id },
      transaction
    })
    if (sessionItem) {
      await sessionItem.update(
        {
          membersSoFar: sessionItem.membersSoFar + quantity
        },
        { transaction }
      )
    }
    await transaction.commit()
    return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.endSession = async sessionId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const session = await db.TrainingSession.findByPk(sessionId, {
      transaction
    })
    if (!session) {
      throw new Error('This session does not exist')
    }
    if (session.startTime < new Date()) {
      throw new Error('This session has already elapsed.')
    }
    await session.update(
      {
        active: 0,
        state: 'ENDED'
      },
      { transaction }
    )
    const roomId = session.roomId
    const room = await db.Room.findByPk(roomId, {
      transaction
    })
    await room.update(
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

exports.postponeSession = async (
  sessionId,
  startTime,
  endTime,
  roomId,
  trainerId
) => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    const session = await db.TrainingSession.findOne(
      { where: { id: +sessionId }, include: [{ model: db.ServiceType }] },
      {
        transaction
      }
    )
    if (!session) {
      throw new Error('This session does not exist')
    }
    if (session.startTime < new Date()) {
      throw new Error('This session has already elapsed.')
    }

    let duplicateSession = JSON.parse(JSON.stringify(session))

    console.log(session.startTime)
    console.log(duplicateSession.startTime)

    const sessions = await db.TrainingSession.findAll({
      include: [{ model: db.Room }]
    })

    for (let i = 0; i < sessions.length; i++) {
      if (
        moment(sessions[i].startTime).format() === moment(startTime).format()
      ) {
        if (
          sessions[i].roomId === +roomId &&
          sessions[i].Room.available === false
        ) {
          throw new Error(
            `This room is in use between ${moment(sessions[i].startTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )} and ${moment(sessions[i].endTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`
          )
        }
        if (sessions[i].trainerId === +trainerId) {
          throw new Error(
            `This trainer has a session between ${moment(
              sessions[i].startTime
            ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
              sessions[i].endTime
            ).format('MMMM Do YYYY, h:mm:ss a')}`
          )
        }
      }
      if (
        moment(endTime).format() >= moment(sessions[i].startTime).format() &&
        moment(endTime).format() <= moment(sessions[i].endTime).format()
      ) {
        if (
          sessions[i].roomId === +roomId &&
          sessions[i].Room.available === false
        ) {
          throw new Error(
            `This room is in use between ${moment(sessions[i].startTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )} and ${moment(sessions[i].endTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`
          )
        }
        if (sessions[i].trainerId === +trainerId) {
          throw new Error(
            `This trainer has a session between ${moment(
              sessions[i].startTime
            ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
              sessions[i].endTime
            ).format('MMMM Do YYYY, h:mm:ss a')}`
          )
        }
      }
      if (
        moment(startTime).format() >= moment(sessions[i].startTime).format() &&
        moment(startTime).format() <= moment(sessions[i].endTime).format()
      ) {
        if (
          sessions[i].roomId === +roomId &&
          sessions[i].Room.available === false
        ) {
          throw new Error(
            `This room is in use between ${moment(sessions[i].startTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )} and ${moment(sessions[i].endTime).format(
              'MMMM Do YYYY, h:mm:ss a'
            )}`
          )
        }
        if (sessions[i].trainerId === +trainerId) {
          throw new Error(
            `This trainer has a session between ${moment(
              sessions[i].startTime
            ).format('MMMM Do YYYY, h:mm:ss a')} and ${moment(
              sessions[i].endTime
            ).format('MMMM Do YYYY, h:mm:ss a')}`
          )
        }
      }
    }

    await session.update(
      {
        startTime: startTime,
        endTime: endTime,
        roomId: roomId
      },
      { transaction }
    )

    sendSms(
      '+254740700076',
      `Session Id ${duplicateSession.id} and of ServiceType ${
        duplicateSession.ServiceType.name
      } which was to take place from ${moment(
        duplicateSession.startTime
      ).format('MMMM Do YYYY, h:mm:ss a')} to ${moment(
        duplicateSession.endTime
      ).format(
        'MMMM Do YYYY, h:mm:ss a'
      )} has been postponed and will now start from ${moment(
        session.startTime
      ).format('MMMM Do YYYY, h:mm:ss a')} up to ${moment(
        session.endTime
      ).format('MMMM Do YYYY, h:mm:ss a')}`
    )

    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.bookingCheck = async (id, memberId) => {
  try {
    // check if session in available
    const session = await db.MemberBooking.findAll({
      where: { memberId: memberId, sessionId: id, status: 'BOOKED' }
    })
    if (session === undefined || session.length == 0) {
      console.log('FALSE')
      console.log(session)
      return false
    } else {
      console.log('TRUE')
      console.log(session)
      return true
    }
  } catch (e) {
    throw e
  }
}

exports.cancelSession = async sessionId => {
  const transaction = await sequelize.transaction()
  try {
    // check if session in available
    console.log(sessionId, typeof +sessionId)
    const session = await db.TrainingSession.findOne(
      { where: { id: +sessionId }, include: [{ model: db.ServiceType }] },
      {
        transaction
      }
    )
    if (!session) {
      throw new Error('This session does not exist')
    }
    if (session.startTime < new Date()) {
      throw new Error('This session has already elapsed.')
    }
    await session.update(
      {
        active: 0,
        state: 'CANCELLED'
      },
      { transaction }
    )
    const roomId = session.roomId
    const room = await db.Room.findByPk(roomId, {
      transaction
    })
    await room.update(
      {
        available: 1
      },
      { transaction }
    )

    sendSms(
      '+254740700076',
      `Session Id ${session.id} and of ServiceType ${
        session.ServiceType.name
      } which was to take place from ${moment(session.startTime).format(
        'MMMM Do YYYY, h:mm:ss a'
      )} to ${moment(session.endTime).format(
        'MMMM Do YYYY, h:mm:ss a'
      )} has been cancelled.`
    )

    await transaction.commit()
    //return this.getSession(userId)
  } catch (e) {
    transaction.rollback()
    throw e
  }
}

exports.totalSessionsPerRoom = async () => {
  try {
    const totalSessions = await db.TrainingSession.findAll({
      attributes: [
        'roomId',
        [
          sequelize.fn('count', sequelize.col('TrainingSession.id')),
          'total_count'
        ]
      ],
      group: ['roomId'],
      include: [db.Room]
    })
    const totalNumber = await db.TrainingSession.findAll({
      attributes: [
        [
          sequelize.fn('count', sequelize.col('TrainingSession.id')),
          'total_number'
        ]
      ]
    })

    return { totalSessions, totalNumber }
  } catch (e) {
    throw e
  }
}

exports.getFilteredTrainingSessions = async (startTime, endTime) => {
  return db.TrainingSession.findAndCountAll({
    where: {
      startTime: {
        [Op.gte]: startTime
      },
      endTime: {
        [Op.lte]: endTime
      }
    },
    include: db.ServiceType
  })
}
