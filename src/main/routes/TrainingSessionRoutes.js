const Router = require('express')
const trainingSessionController = require('../controllers/TrainingSessionController')

const router = Router()

router.post('/', trainingSessionController.createTrainingSession)
router.get('/', trainingSessionController.getTrainingSessions)
router.delete('/:id', trainingSessionController.deleteTrainingSession)
router.put('/:id', trainingSessionController.updateTrainingSession)

module.exports = router
