const db = require('../db/models/index')
const Mailer = require('../utils/mailer')
const { v4: uuidv4 } = require('uuid')
const moment = require('moment')
const { sequelize } = require('../db/models/index')
const bcrypt = require('bcrypt')

async function hashPassword (password) {
  return await bcrypt.hash(password, 10)
}

exports.register = async data => {
  return db.User.create(data)
}

exports.guestUser = async data => {
  return db.User.create(data)
}

exports.updateUser = async (data, root) => {
  return db.User.update(data, root)
}

exports.getPagination = (page, size) => {
  const limit = size ? +size : 5
  const offset = page ? page * limit : 0

  return { limit, offset }
}

exports.getPagingData = (data, page, limit) => {
  const { count: totalUsers, rows: users } = data
  const currentPage = page ? +page : 0
  const totalPages = Math.ceil(totalUsers / limit)

  return { totalUsers, users, totalPages, currentPage }
}

exports.getUsers = async () => {
  return db.User.findAndCountAll()
}

exports.getUser = async data => {
  return db.User.findOne(data)
}

exports.getUserByPk = async data => {
  return db.User.findByPk(data)
}

exports.deleteUser = async data => {
  return db.User.destroy(data)
}

exports.totalUsers = async () => {
  try {
    const totalUsers = await db.User.findAll({
      attributes: [
        [sequelize.fn('count', sequelize.col('email')), 'total_users']
      ]
    })
    return totalUsers
  } catch (e) {
    throw e
  }
}


exports.sendForgotPasswordEmail = async (user, token) => {
  const m = new Mailer()
  await m.send({
    template: 'forgotPassword',
    message: {
      to: user.email,
      subject: 'Hello from Great Body Gym Ltd',
      text: `To reset your password click here ${'http://localhost:3000/reset-password-change'}/passwordReset?token=${
        token.token
      } If you don't wish to reset your password, disregard this email and no action will be taken.
The Great Body Gym Ltd Team
https://localhost:3000`
    },
    locals: {
      user: user.email,
      token
    }
  })
}

exports.forgotPassword = email => {
  return db.User.findOne({ where: { email } }).then(user => {
    if (!user || !user.id) throw new Error('This account does not exist')
    return db.ForgotPasswordToken.findOne({
      where: { userId: user.id }
    }).then(token => {
      if (token && token.id)
        return token
          .update({
            used: false,
            token: uuidv4(),
            expiry: moment().add(
              +process.env.FORGOT_PASSWORD_TOKEN_EXPIRY_HOURS,
              'hours'
            )
          })
          .then(token => {
            return this.sendForgotPasswordEmail(user, token).then(data => {
              return {
                data: 'Forgot password id sent to your email.',
                token: token.token
              }
            })
          })
      else
        return db.ForgotPasswordToken.create({
          userId: user.id,
          used: false,
          token: uuidv4(),
          expiry: moment().add(
            +process.env.FORGOT_PASSWORD_TOKEN_EXPIRY_HOURS,
            'hours'
          )
        }).then(token => {
          return this.sendForgotPasswordEmail(user, token).then(data => {
            return { data: 'Forgot password id sent to your email.' }
          })
        })
    })
  })
}

exports.changeForgottenPassword = async data => {
  return db.ForgotPasswordToken.findOne({ where: { token: data.token } }).then(
    token => {
      if (!token || !token.id)
        throw new Error(
          'Invalid token. Please use the link sent to your email.'
        )
      if (token.used)
        throw new Error(
          'Invalid token. This token has already been used. Please request for another.'
        )
      if (new Date() > token.expiry)
        throw new Error(
          'Invalid token. This link has expired. Please request for a new one.'
        )
      return sequelize.transaction(transaction => {
        return token.getUser({ transaction }).then(async user => {
          const hashedPassword = await hashPassword(data.password)
          return user
            .update({ password: await hashedPassword }, { transaction })
            .then(user => {
              return token.update({ used: true }).then(token => {
                let user_ = user.dataValues
                delete user_.password
                return user_
              })
            })
        })
      })
    }
  )
}
