const roomService = require('../services/RoomService')
const ReqValidator = require('../utils/validator')

exports.createRoom = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      label: 'required|string',
      size: 'required'
    })
    if (!valid) return
    const data = {
      label: req.body.label,
      size: req.body.size
    }
    await roomService.createRoom(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateRoom = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      label: 'required|string',
      size: 'required'
    })
    if (!valid) return
    const data = {
      label: req.body.label,
      size: req.body.size
    }

    const roomId = req.params.id
    await roomService.updateRoom(data, {
      where: {
        id: roomId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteRoom = async (req, res, next) => {
  try {
    const roomId = req.params.id
    await roomService.deleteRoom({
      where: {
        id: roomId
      }
    })
    res.status(200).json({
      data: null,
      message: `Room ${roomId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getRooms = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = roomService.getPagination(page, size)

  try {
    const rooms = await roomService.getRooms()
    const updatedRooms = roomService.getPagingData(rooms, page, limit)

    res.status(200).json(updatedRooms)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
