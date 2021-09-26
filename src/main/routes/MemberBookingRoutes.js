const Router = require('express')
const memberBookingController = require('../controllers/MemberBookingController')
const trainingSessionController = require('../controllers/TrainingSessionController')

const router = Router()

router.post('/', memberBookingController.createMemberBooking)
router.post('/book', trainingSessionController.updateSession)
router.get('/', memberBookingController.getMemberBookings)
router.delete('/:id', memberBookingController.deleteMemberBooking)
router.put('/:id', memberBookingController.updateMemberBooking)

module.exports = router
