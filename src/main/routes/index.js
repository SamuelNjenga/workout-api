const Router = require('express')
const RoleRoutes = require('./RoleRoutes')
const AuthRoutes = require('./AuthRoutes')


const router = Router()

router.use('/roles', RoleRoutes)
router.use('/users', AuthRoutes)

module.exports = router
