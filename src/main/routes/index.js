const Router = require('express')

const RoleRoutes = require('./RoleRoutes')
const RoomRoutes = require('./RoomRoutes')
const AuthRoutes = require('./AuthRoutes')
const EquipmentRoutes = require('./EquipmentRoutes')

const router = Router()

router.use('/roles', RoleRoutes)
router.use('/rooms', RoomRoutes)
router.use('/users', AuthRoutes)
router.use('/equipment', EquipmentRoutes)

module.exports = router
