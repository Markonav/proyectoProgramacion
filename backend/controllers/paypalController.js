const {createOrder, capturePayment, orderDetails, authorizePayment, updateOrderAmount } = require('../services/paypalService');

async function postCreateOrder(req, res) {
    try {
        const { total, currency } = req.body;
        
        if(!total || isNaN(Number(total)) || Number(total) <= 0) {
            return res.status(400).json({ message: 'Monto inválido' });
        }

        const order = await createOrder(total, currency);

        res.status(201).json({message: 'Orden creada', order, orderId: order.id, timestamp: new Date().toISOString() });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            return res.status(504).json({ error: 'Timeout: PayPal no respondió a tiempo' });
        }
        console.error('[postCreateOrder]', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al crear la orden' });
    }
}

async function postCapturePayment(req, res) {
    try {
        const { orderId } = req.params;
        const capture = await capturePayment(orderId);
        res.status(200).json({ message: 'Pago capturado', capture, captureId: capture.id, timestamp: new Date().toISOString() });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            return res.status(504).json({ error: 'Timeout: PayPal no respondió a tiempo' });
        }
        console.error('[postCapturePayment]', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al capturar el pago' });
    }
}

async function getOrderDetails(req, res) {
    try {
        const { orderId } = req.params;
        const orderDetailsInfo = await orderDetails(orderId);
        res.status(200).json({ message: 'Detalles de la orden obtenidos', orderDetailsInfo, timestamp: new Date().toISOString() });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            return res.status(504).json({ error: 'Timeout: PayPal no respondió a tiempo' });
        }
        console.error('[getOrderDetailsController]', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al obtener los detalles de la orden' });
    }
}

async function postAuthorizePayment(req, res) {
    try {
        const { orderId } = req.params;
        const authorization = await authorizePayment(orderId);
        res.status(200).json({ message: 'Pago autorizado', authorization, authorizationId: authorization.id, timestamp: new Date().toISOString() });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            return res.status(504).json({ error: 'Timeout: PayPal no respondió a tiempo' });
        }
        console.error('[postAuthorizePayment]', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al autorizar el pago' });
    }
}

async function patchUpdateOrderAmount(req, res) {
    try {
        const { orderId } = req.params;
        const { newTotal, currency } = req.body;
        
        if(!newTotal || isNaN(Number(newTotal)) || Number(newTotal) <= 0) {
            return res.status(400).json({ message: 'Nuevo monto inválido' });
        }

        const updatedOrder = await updateOrderAmount(orderId, newTotal, currency);

        res.status(200).json({ message: 'Monto de la orden actualizado', updatedOrder, timestamp: new Date().toISOString() });
    } catch (error) {
        if (error.message.includes('Timeout')) {
            return res.status(504).json({ error: 'Timeout: PayPal no respondió a tiempo' });
        }
        console.error('[patchUpdateOrderAmount]', error.response?.data || error.message);
        res.status(500).json({ error: 'Error al actualizar el monto de la orden' });
    }
}

module.exports = { postCreateOrder, postCapturePayment, getOrderDetails, postAuthorizePayment, patchUpdateOrderAmount };
