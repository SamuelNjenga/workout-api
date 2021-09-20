const Router = require('express')

const RoleRoutes = require('./RoleRoutes')
const RoomRoutes = require('./RoomRoutes')
const AuthRoutes = require('./AuthRoutes')
const EquipmentRoutes = require('./EquipmentRoutes')
const ServiceTypeRoutes = require('./ServiceTypeRoutes')
const MemberRegRoutes = require('./MemberRegistrationRoutes')
const MemberPaymentRoutes = require('./MemberPaymentRoutes')

const router = Router()

router.use('/roles', RoleRoutes)
router.use('/rooms', RoomRoutes)
router.use('/users', AuthRoutes)
router.use('/equipment', EquipmentRoutes)
router.use('/serviceTypes', ServiceTypeRoutes)
router.use('/memberRegistrations', MemberRegRoutes)
router.use('/memberPayments', MemberPaymentRoutes)

module.exports = router
