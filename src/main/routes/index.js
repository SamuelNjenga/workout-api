const Router = require('express')
const RoleRoutes = require('./RoleRoutes')

const router = Router()

router.use('/roles', RoleRoutes)

module.exports = router
