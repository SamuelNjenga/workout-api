const Router = require('express')
const memberRegController = require('../controllers/MemberRegistrationController')

const router = Router()

router.post('/', memberRegController.createMember)
router.get('/', memberRegController.getMembers)
router.delete('/:id', memberRegController.deleteMember)
router.put('/:id', memberRegController.updateMember)

module.exports = router
