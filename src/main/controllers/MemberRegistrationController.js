const memberRegistrationService = require('../services/MemberRegistrationService')
const ReqValidator = require('../utils/validator')

exports.createMember = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      userId: 'required|integer'
    })
    if (!valid) return
    const data = {
      userId: req.body.userId,
      active: req.body.active
    }
    await memberRegistrationService.createMemberRegistration(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateMember = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      userId: 'required|integer'
    })
    if (!valid) return
    const data = {
      userId: req.body.userId,
      active:req.body.active
    }

    const memberId = req.params.id
    await memberRegistrationService.updateMemberRegistration(data, {
      where: {
        id: memberId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteMember = async (req, res, next) => {
  try {
    const memberId = req.params.id
    await memberRegistrationService.deleteMemberRegistration({
      where: {
        id: memberId
      }
    })
    res.status(200).json({
      data: null,
      message: `Member ${memberId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getMembers = async (req, res, next) => {
  try {
    const members = await memberRegistrationService.getMembers()
    res.status(200).json(members)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
