const Router = require('express')
const memberPaymentController = require('../controllers/MemberPaymentController')

const router = Router()

router.post('/', memberPaymentController.createMemberPayment)
router.get('/', memberPaymentController.getMemberPayments)
router.post('/search', memberPaymentController.getSearchedPayments)
router.post('/filter', memberPaymentController.getFilteredPayments)
router.get('/amount', memberPaymentController.totalAmount)
router.delete('/:id', memberPaymentController.deleteMemberPayment)
router.put('/:id', memberPaymentController.updateMemberPayment)

module.exports = router
