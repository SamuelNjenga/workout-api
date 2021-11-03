const Router = require('express')
const trainingSessionController = require('../controllers/TrainingSessionController')

const router = Router()

router.post('/', trainingSessionController.createTrainingSession)
router.post('/end', trainingSessionController.endSession)
router.post('/postpone', trainingSessionController.postponeSession)
router.post('/cancel', trainingSessionController.cancelSession)
router.post('/check', trainingSessionController.bookingCheck)
router.get('/', trainingSessionController.getTrainingSessions)
router.get('/admin', trainingSessionController.getAdminTrainingSessions)
router.delete('/:id', trainingSessionController.deleteTrainingSession)
router.put('/:id', trainingSessionController.updateTrainingSession)

module.exports = router
