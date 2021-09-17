const jwt = require('jsonwebtoken')
require('dotenv/config')
const authService = require('../services/AuthService')
const authorization = async (req, res, next) => {
  if (req.headers['x-access-token']) {
    try {
      const accessToken = req.headers['x-access-token']
      const { userId, roleId, exp } = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET
      )

      if (roleId !== 1) {
        return res.status(403).json({
          error: 'Unauthorized'
        })
      }
      res.locals.loggedInUser = await authService.getUser({
        where: {
          id: userId
        }
      })
      next()
    } catch (error) {
      next(error)
    }
  } else {
    res.sendStatus(403)
  }
}
module.exports = authorization
