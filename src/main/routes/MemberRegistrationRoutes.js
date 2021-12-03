const Router = require('express')
const memberRegController = require('../controllers/MemberRegistrationController')

const router = Router()

router.post('/', memberRegController.createMember)
router.post('/details', memberRegController.getMemberDetails)
router.post('/activate', memberRegController.activateMember)
router.post('/diactivate', memberRegController.diactivateMember)
router.get('/', memberRegController.getMembers)
router.delete('/:id', memberRegController.deleteMember)
router.put('/:id', memberRegController.updateMember)

module.exports = router
