const db = require('../db/models/index')
const { sequelize } = require('../db/models/index')
const moment = require('moment')

exports.createTrainingSession = async data => {
  const sessions = await db.TrainingSession.findAll({
    include: [{ model: db.Room }]
  })
  for (let i = 0; i < sessions.length; i++) {
    console.log('S LENGTH', sessions.length)
    console.log('Session  Start Time', sessions[i].startTime, data.startTime)

    if (
      moment(sessions[i].startTime).format() ===
        moment(data.startTime).format() &&
      sessions[i].roomId === +data.roomId &&
      sessions[i].Room.available === false
    ) {
      throw new Error('This room is in use between ')
    }
    if (
      moment(data.endTime).format() >= moment(sessions[i].startTime).format() &&
      moment(data.endTime).format() <= moment(sessions[i].endTime).format() &&
      sessions[i].roomId === +data.roomId &&
      sessions[i].Room.available === false
    ) {
      throw new Error('This room is in use between 1')
    }
    if (
      moment(data.startTime).format() >=
        moment(sessions[i].startTime).format() &&
      moment(data.startTime).format() <= moment(sessions[i].endTime).format() &&
      sessions[i].roomId === +data.roomId &&
      sessions[i].Room.available === false
    ) {
      throw new Error('This room is in use between 2')
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
    include: [{ model: db.TrainingSession }]
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
    const roomId = session.id
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

exports.postponeSession = async (sessionId, startTime, endTime) => {
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
        startTime: startTime,
        endTime: endTime
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

exports.cancelSession = async sessionId => {
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
        state: 'CANCELLED'
      },
      { transaction }
    )
    const roomId = session.id
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
