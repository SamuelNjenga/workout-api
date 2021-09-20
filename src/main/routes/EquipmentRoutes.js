const Router = require('express')
const equipmentController = require('../controllers/EquipmentController')

const router = Router()

router.post('/', equipmentController.createEquipment)
router.get('/', equipmentController.getEquipment)
router.delete('/:id', equipmentController.deleteEquipment)
router.put('/:id', equipmentController.updateEquipment)

module.exports = router
