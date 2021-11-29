const equipmentService = require('../services/EquipmentService')
const ReqValidator = require('../utils/validator')

exports.createEquipment = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      title: 'required|string',
      picture: 'string'
    })
    if (!valid) return
    const data = {
      title: req.body.title,
      picture: req.body.picture
    }
    await equipmentService.createEquipment(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateEquipment = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      title: 'required|string',
      picture: 'string'
    })
    if (!valid) return
    const data = {
      title: req.body.title,
      picture: req.body.picture
    }

    const equipmentId = req.params.id
    await equipmentService.updateEquipment(data, {
      where: {
        id: equipmentId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteEquipment = async (req, res, next) => {
  try {
    const equipmentId = req.params.id
    await equipmentService.deleteEquipment({
      where: {
        id: equipmentId
      }
    })
    res.status(200).json({
      data: null,
      message: `Equipment ${equipmentId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getEquipment = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = equipmentService.getPagination(page, size)

  try {
    const equipment = await equipmentService.getEquipment()
    const updatedEquipments = equipmentService.getPagingData(
      equipment,
      page,
      limit
    )
    res.status(200).json(updatedEquipments)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}

exports.diactivateEquipment = async (req, res, next) => {
  try {
    const data = {
      equipmentId: req.body.equipmentId
    }
    const response = await equipmentService.diactivateEquipment(
      data.equipmentId
    )
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.activateEquipment = async (req, res, next) => {
  try {
    const data = {
      equipmentId: req.body.equipmentId
    }
    const response = await equipmentService.activateEquipment(data.equipmentId)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
