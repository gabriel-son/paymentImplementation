const router = require('express').Router();
const PaymentCtrl = require('./../controller');

router.post('/card_payment', PaymentCtrl.card_payment);
router.get('/paystack/callback', PaymentCtrl.confirm_transaction);

module.exports = router;