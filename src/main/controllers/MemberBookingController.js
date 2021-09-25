const memberBookingService = require('../services/MemberBookingService')
const ReqValidator = require('../utils/validator')

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
  try {
    const bookings = await memberBookingService.getMemberBookings()
    res.status(200).json(bookings)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}