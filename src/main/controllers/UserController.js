const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')

const authService = require('../services/AuthService')
const memberRegService = require('../services/MemberRegistrationService')

async function validatePassword (plainPassword, hashedPassword) {
  return await bcrypt.compare(plainPassword, hashedPassword)
}

exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body
    const user = await authService.getUser({
      where: {
        email: email
      }
    })
    if (!user) throw new Error('Email does not exist')
    const validPassword = await validatePassword(password, user.password)
    if (!validPassword) throw new Error('Password is not correct')
    console.log('USER ID', user.roleId)
    if (user.roleId === 3)
      throw new Error('Make sure you are an admin to log in')

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

    //const memberId = await memberRegService.returnMember(user.id)

    res.status(200).json({
      data: {
        email: user.email,
        roleId: user.roleId,
        firstName: user.firstName,
        lastName: user.lastName,
        id: user.id
      },
      accessToken
    })
  } catch (err) {
    res.status(400).json({ message: err.message })
    next(err)
  }
}
