const express = require('express');
const router = express.Router();
const { verificarToken } = require("../middleware/authMiddleware");
const { postCreateOrder, postCapturePayment, getOrderDetails, postAuthorizePayment, patchUpdateOrderAmount } = require('../controllers/paypalController');


router.post('/', verificarToken, postCreateOrder);
router.post('/:orderId/capture', verificarToken, postCapturePayment);
router.get('/:orderId', verificarToken, getOrderDetails);
router.post('/:orderId/authorize', verificarToken, postAuthorizePayment);
router.patch('/:orderId/amount', verificarToken, patchUpdateOrderAmount);

module.exports = router;