const memberBookingService = require('../services/MemberBookingService')
const ReqValidator = require('../utils/validator')
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
  const transaction = await sequelize.transaction()
  try {
    const userId = req.params.id
    const response = await memberBookingService.getBookingHistory(
      userId,
      transaction
    )
    await transaction.commit()
    res.status(200).json(response)
  } catch (err) {
    transaction.rollback()
    next(err)
  }
}
