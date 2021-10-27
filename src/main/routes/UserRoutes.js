const Router = require('express')
const authController = require('../controllers/AuthController')
const router = Router()
//const userAuthentication = require('../middlewares/userAuthentication')

router.get('/:id',authController.getUserByPk)

module.exports = router
