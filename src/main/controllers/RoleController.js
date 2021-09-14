const roleService = require('../services/RoleService')
const ReqValidator = require('../utils/validator')

exports.createRole = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      roleName: 'required|string'
    })
    if (!valid) return
    const data = {
      roleName: req.body.roleName
    }
    await roleService.createRole(data)
    res.status(201).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.updateRole = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      roleName: 'required|string'
    })
    if (!valid) return
    const data = {
      roleName: req.body.roleName
    }

    const roleId = req.params.id
    await roleService.updateRole(data, {
      where: {
        id: roleId
      }
    })
    res.status(200).json(data)
  } catch (err) {
    console.log(err)
    next(err)
  }
}

exports.deleteRole = async (req, res, next) => {
  try {
    const roleId = req.params.id
    await roleService.deleteRole({
      where: {
        id: roleId
      }
    })
    res.status(200).json({
      data: null,
      message: `Role ${roleId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getRoles = async (req, res, next) => {
  try {
    const roles = await roleService.getRoles()
    res.status(200).json(roles)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}
