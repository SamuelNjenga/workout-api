const Router = require('express')
const memberPaymentController = require('../controllers/MemberPaymentController')

const router = Router()

router.post('/', memberPaymentController.createMemberPayment)
router.get('/', memberPaymentController.getMemberPayments)
router.delete('/:id', memberPaymentController.deleteMemberPayment)
router.put('/:id', memberPaymentController.updateMemberPayment)

module.exports = router
