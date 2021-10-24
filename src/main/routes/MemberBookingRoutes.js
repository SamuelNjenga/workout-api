const Router = require('express')
const memberBookingController = require('../controllers/MemberBookingController')
const trainingSessionController = require('../controllers/TrainingSessionController')

const router = Router()

router.post('/', memberBookingController.createMemberBooking)
router.post('/book', trainingSessionController.updateSession)
router.post('/cancel', memberBookingController.cancelBooking)
router.get('/', memberBookingController.getMemberBookings)
router.get('/:id', memberBookingController.getBookingHistory)
router.get('/all/:id', memberBookingController.getAllMemberBookings)
router.delete('/:id', memberBookingController.deleteMemberBooking)
router.put('/:id', memberBookingController.updateMemberBooking)

module.exports = router
