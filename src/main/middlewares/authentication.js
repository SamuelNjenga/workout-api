const jwt = require('jsonwebtoken')
require('dotenv/config')
const authService = require('../services/AuthService')
const authentication = async (req, res, next) => {
  if (req.headers['x-access-token']) {
    try {
      const accessToken = req.headers['x-access-token']
      const { userId, exp } = await jwt.verify(
        accessToken,
        process.env.JWT_SECRET
      )
      // If token has expired
      // if (exp < Date.now().valueOf() / 1000) {
      //   return res.status(401).json({
      //     error: 'JWT token has expired, please login to obtain a new one'
      //   })
      // }
      res.locals.loggedInUser = await authService.getUser({
        where: {
          id: userId
        }
      })
      console.log('Lion')
      next()
    } catch (error) {
      next(error)
    }
  } else {
    res.sendStatus(403)
  }
}
module.exports = authentication
