const Router = require('express')

const RoleRoutes = require('./RoleRoutes')
const RoomRoutes = require('./RoomRoutes')
const AuthRoutes = require('./AuthRoutes')
const EquipmentRoutes = require('./EquipmentRoutes')
const ServiceTypeRoutes = require('./ServiceTypeRoutes')
const MemberRegRoutes = require('./MemberRegistrationRoutes')
const MemberPaymentRoutes = require('./MemberPaymentRoutes')
const MemberBookingRoutes = require('./MemberBookingRoutes')
const TrainerProfileRoutes = require('./TrainerProfileRoutes')
const TrainingSessionRoutes = require('./TrainingSessionRoutes')


const router = Router()

router.use('/roles', RoleRoutes)
router.use('/rooms', RoomRoutes)
router.use('/users', AuthRoutes)
router.use('/equipment', EquipmentRoutes)
router.use('/serviceTypes', ServiceTypeRoutes)
router.use('/memberRegistrations', MemberRegRoutes)
router.use('/memberPayments', MemberPaymentRoutes)
router.use('/bookings', MemberBookingRoutes)
router.use('/trainerProfiles', TrainerProfileRoutes)
router.use('/trainingSessions', TrainingSessionRoutes)


module.exports = router
