const authService = require('../services/AuthService')
const memberRegService = require('../services/MemberRegistrationService')
const ReqValidator = require('../utils/validator')
require('dotenv').config()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sequelize } = require('../db/models/index')

async function hashPassword (password) {
  return await bcrypt.hash(password, 10)
}

exports.register = async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const valid = await ReqValidator.validate(req, res, {
      firstName: 'string',
      lastName: 'string',
      email: 'string|email',
      phoneNumber: 'string',
      password: 'string',
      gender: 'string',
      roleId: 'integer'
    })
    if (!valid) return
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      password: req.body.password,
      gender: req.body.gender,
      roleId: req.body.roleId
    }
    let user = await authService.getUser({
      where: {
        email: data.email
      },
      transaction
    })
    if (user) {
      throw new Error('Email already exists')
    }
    const hashedPassword = await hashPassword(data.password)
    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      password: hashedPassword,
      gender: data.gender,
      roleId: 3
    }
    await authService.register(newUser, transaction)
    await transaction.commit()
    res.status(201).json(newUser)
  } catch (err) {
    transaction.rollback()
    next(err)
  }
}

exports.forgotPassword = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      email: 'required'
    })
    if (!valid) return

    const email = req.body.email
    const newUser = await authService.forgotPassword(email)
    res.status(200).json(newUser)
  } catch (err) {
    next(err)
  }
}

exports.changeForgottenPassword = async (req, res, next) => {
  try {
    const valid = await ReqValidator.validate(req, res, {
      password: 'required'
    })
    if (!valid) return

    const data = { token: req.body.token, password: req.body.password }
    const response = await authService.changeForgottenPassword(data)
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}

exports.updateUser = async (req, res, next) => {
  const transaction = await sequelize.transaction()
  try {
    const valid = await ReqValidator.validate(req, res, {
      firstName: 'string',
      lastName: 'string',
      email: 'string|email',
      phoneNumber: 'string',
      // password: 'string',
      gender: 'string',
      roleId: 'integer'
    })
    if (!valid) return
    console.log('P')
    const data = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      phoneNumber: req.body.phoneNumber,
      // password: req.body.password,
      device: req.body.device,
      gender: req.body.gender,
      //roleId: req.body.roleId
      //roleId: data.roleId || 3
      roleId: 3
    }

    const newUser = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber,
      // password: hashedPassword,
      gender: data.gender,
      roleId: 3
    }
    const userId = req.params.id
    await authService.updateUser(newUser, {
      where: {
        id: userId
      },
      transaction
    })
    await transaction.commit()
    res.status(200).json(data)
  } catch (err) {
    transaction.rollback()
    next(err)
  }
}

exports.deleteUser = async (req, res, next) => {
  try {
    const userId = req.params.id
    await authService.deleteUser({
      where: {
        id: userId
      }
    })
    res.status(200).json({
      data: null,
      message: `User ${userId} has been deleted`
    })
  } catch (error) {
    next(error)
  }
}

exports.getUsers = async (req, res, next) => {
  const { page, size } = req.query
  const { limit, offset } = authService.getPagination(page, size)
  try {
    const users = await authService.getUsers()
    const updatedUsers = authService.getPagingData(users, page, limit)
    res.status(200).json(updatedUsers)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}

async function validatePassword (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await authService.getUser({
      where: {
        email: email
      }
    })
    if (!user) return next(new Error('Email does not exist'))
    const validPassword = await validatePassword(password, user.password)
    if (!validPassword) return next(new Error('Password is not correct'))
    const accessToken = jwt.sign(
      {
        userId: user.id,
        roleId: user.roleId
      },
      process.env.JWT_SECRET
      // {
      //   expiresIn: '1d'
      // }
    )
    await authService.updateUser(accessToken, {
      where: {
        id: user.id
      }
    })
    const memberId = await memberRegService.returnMember(user.id)
    res.status(200).json({
      data: {
        email: user.email,
        roleId: user.roleId,
        firstName: user.firstName,
        id: user.id,
        memberId
      },
      accessToken
    })
  } catch (error) {
    res.status(401).json({
      message: 'This member does not have an existing account'
    })
    next(error)
  }
}

exports.getUserByPk = async (req, res, next) => {
  try {
    const user = await authService.getUserByPk(req.params.id)
    res.status(200).json(user)
  } catch (err) {
    res.json({
      message: err
    })
    next(err)
  }
}

exports.totalUsers = async (req, res, next) => {
  try {
    const response = await authService.totalUsers()
    res.status(200).json(response)
  } catch (err) {
    next(err)
  }
}
