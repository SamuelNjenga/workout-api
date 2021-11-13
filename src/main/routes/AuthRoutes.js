const Router = require('express')
const authController = require('../controllers/AuthController')
const authentication = require('../middlewares/authentication')
const authorization = require('../middlewares/authorization')

const router = Router()

router.post('/register', authController.register)
router.post('/login', authController.login)
router.post('/forgot-password', authController.forgotPassword)
router.post('/forgot-password-change', authController.changeForgottenPassword)
router.get('/', authController.getUsers)
router.get('/total', authController.totalUsers)
router.delete('/:id', authentication, authorization, authController.deleteUser)
router.put('/:id', authController.updateUser)

module.exports = router
