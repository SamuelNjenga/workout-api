const Router = require('express')
const trainerProfileController = require('../controllers/TrainerProfileController')

const router = Router()

router.post('/', trainerProfileController.createTrainerProfile)
router.get('/', trainerProfileController.getTrainers)
router.delete('/:id', trainerProfileController.deleteTrainerProfile)
router.put('/:id', trainerProfileController.updateTrainerProfile)

module.exports = router
