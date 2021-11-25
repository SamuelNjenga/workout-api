const Router = require('express')
const authController = require('../controllers/AuthController')
const userController = require('../controllers/UserController')
const router = Router()
//const userAuthentication = require('../middlewares/userAuthentication')

router.get('/:id',authController.getUserByPk)
router.post('/adminLogin', userController.adminLogin)

module.exports = router
