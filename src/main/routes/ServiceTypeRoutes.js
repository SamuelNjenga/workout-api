const Router = require('express')
const serviceTypeController = require('../controllers/ServiceTypeController')

const router = Router()

router.post('/', serviceTypeController.createServiceType)
router.get('/', serviceTypeController.getServiceTypes)
router.delete('/:id', serviceTypeController.deleteServiceType)
router.put('/:id', serviceTypeController.updateServiceType)

module.exports = router
