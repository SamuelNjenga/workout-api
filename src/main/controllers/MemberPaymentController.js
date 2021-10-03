const memberPaymentService = require('../services/MemberPaymentService')
const ReqValidator = require('../utils/validator')

exports.createMemberPayment = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      memberId: 'required|integer',
      amount: 'required',
      to: 'required',
      from: 'required'
    })
    if (!valid) return
    const data = {
      memberId: req.body.memberId,
      amount: req.body.amount,
      to: req.body.to,
      from: req.body.from
    }
    await memberPaymentService.createMemberPayment(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateMemberPayment = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      memberId: 'required|integer',
      amount: 'required',
      to: 'required',
      from: 'required'
    })
    if (!valid) return
    const data = {
      memberId: req.body.memberId,
      amount: req.body.amount,
      to: req.body.to,
      from: req.body.from
    }

    const paymentId = req.params.id
    await memberPaymentService.updateMemberPayment(data, {
      where: {
        id: paymentId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteMemberPayment = async (req, res, next) => {
  try {
    const paymentId = req.params.id
    await memberPaymentService.deleteMemberPayment({
      where: {
        id: paymentId
      }
    })
    res.status(200).json({
      data: null,
      message: `Payment ${paymentId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getMemberPayments = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = memberPaymentService.getPagination(page, size)
  try {
    const payments = await memberPaymentService.getMemberPayments()
    const updatedPayments = memberPaymentService.getPagingData(
      payments,
      page,
      limit
    )
    res.status(200).json(updatedPayments)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
