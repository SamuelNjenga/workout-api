const memberBookingService = require('../services/MemberBookingService')
const ReqValidator = require('../utils/validator')
const db = require('../db/models')
const { sequelize } = require('../db/models/index')

exports.createMemberBooking = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      sessionId: 'required|integer',
      memberId: 'required|integer',
      status: 'required|string'
    })
    if (!valid) return
    const data = {
      sessionId: req.body.sessionId,
      memberId: req.body.memberId,
      status: req.body.status
    }
    await memberBookingService.createMemberBooking(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateMemberBooking = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      sessionId: 'required|integer',
      memberId: 'required|integer',
      status: 'required|string'
    })
    if (!valid) return
    const data = {
      sessionId: req.body.sessionId,
      memberId: req.body.memberId,
      status: req.body.status
    }

    const bookingId = req.params.id
    await memberBookingService.updateMemberBooking(data, {
      where: {
        id: bookingId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteMemberBooking = async (req, res, next) => {
  try {
    const bookingId = req.params.id
    await memberBookingService.deleteMemberBooking({
      where: {
        id: bookingId
      }
    })
    res.status(200).json({
      data: null,
      message: `MemberBooking ${bookingId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getMemberBookings = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = memberBookingService.getPagination(page, size)

  try {
    const bookings = await memberBookingService.getMemberBookings()
    const updatedBookings = memberBookingService.getPagingData(
      bookings,
      page,
      limit
    )
    res.status(200).json(updatedBookings)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}

exports.getBookingHistory = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = memberBookingService.getPagination(page, size)
  const memberId = req.params.id
  db.MemberBooking.findAndCountAll({
    where: {
      memberId: memberId
    },
    order: [['updatedAt', 'DESC']],
    limit,
    offset
  })
    .then(data => {
      const response = memberBookingService.getPagingData(data, page, limit)
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

exports.cancelBooking = async (req, res, next) => {
  const transaction = await sequelize.transaction()
  const { page, size } = req.query
  const { limit, offset } = memberBookingService.getPagination(page, size)

  try {
    const data = {
      bookingId: req.body.bookingId
    }

    // check if session in available
    const session = await db.MemberBooking.findOne({
      where: {
        id: data.bookingId
      },
      include: [{ model: db.TrainingSession }],
      transaction
    })
    if (!session) {
      throw new Error('This session does not exist')
    }
    // if (session.TrainingSession.startTime < new Date()) {
    //   throw new Error('This session has already elapsed.')
    // }
    await session.update(
      {
        status: 'CANCELLED'
      },
      { transaction }
    )

    await transaction.commit()

    db.MemberBooking.findAndCountAll({
      where: {
        memberId: session.memberId
      },
      order: [['updatedAt', 'DESC']],
      limit,
      offset
    })
      .then(data => {
        const response = memberBookingService.getPagingData(data, page, limit)
        res.status(200).json(response)
      })
      .catch(err => {
        res.status(500).send({
          message:
            'Server error occurred while retrieving the wishlists.Try again.'
        })
        next(err)
      })

    //return this.getSession(userId)

    // const response = await memberBookingService.cancelBooking(data.bookingId)
    // res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
