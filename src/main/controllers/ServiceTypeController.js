const serviceTypeService = require('../services/ServiceTypeService')
const ReqValidator = require('../utils/validator')

exports.createServiceType = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      name: 'required|string',
      description: 'string'
    })
    if (!valid) return
    const data = {
      name: req.body.name,
      description: req.body.description
    }
    await serviceTypeService.createServiceType(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateServiceType = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      name: 'required|string',
      description: 'string'
    })
    if (!valid) return
    const data = {
      name: req.body.name,
      description: req.body.description
    }

    const serviceTypeId = req.params.id
    await serviceTypeService.updateServiceType(data, {
      where: {
        id: serviceTypeId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteServiceType = async (req, res, next) => {
  try {
    const serviceTypeId = req.params.id
    await serviceTypeService.deleteServiceType({
      where: {
        id: serviceTypeId
      }
    })
    res.status(200).json({
      data: null,
      message: `ServiceType ${serviceTypeId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getServiceTypes = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = serviceTypeService.getPagination(page, size)

  try {
    const serviceTypes = await serviceTypeService.getServiceTypes()
    const updatedServiceTypes = serviceTypeService.getPagingData(
      serviceTypes,
      page,
      limit
    )
    res.status(200).json(updatedServiceTypes)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
