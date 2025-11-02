const axios = require('axios');
const PAYPAL_API = process.env.PAYPAL_API; // Usar sandbox para pruebas
const CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const SECRET = process.env.PAYPAL_SECRET;

const paypalClient = axios.create({
    baseURL: PAYPAL_API,
    timeout: 5000,
    headers: {
        'Content-Type': 'application/json'
    }
});

async function getAccessToken() {
    try {
        const response = await axios({
            url: `${PAYPAL_API}/v1/oauth2/token`,
            method: 'post',
            auth: {
                username: CLIENT_ID,
                password: SECRET
            },
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            data: 'grant_type=client_credentials',
            timeout: 5000
        });
        return response.data.access_token;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: PayPal no respondió a tiempo al solicitar el token');
        }
        throw error;
    }
}

async function createOrder(total, currency = 'USD') {
    try {
        const accessToken = await getAccessToken();
        const response = await paypalClient.post(
            '/v2/checkout/orders', {
                intent: 'AUTHORIZE',
                purchase_units: [
                    {
                        amount: {
                            currency_code: currency,
                            value: total
                        }
                    }
                ]
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: Paypal no respondió a tiempo');
        }
        throw error;
    }
}

async function capturePayment(orderId) {
    try {
        const accessToken = await getAccessToken();
        const response = await paypalClient.post(
            `/v2/checkout/orders/${orderId}/capture`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: PayPal no respondió a tiempo al capturar el pago');
        }
        throw error;
    }
}

async function orderDetails(orderId) {
    try {
        const accessToken = await getAccessToken();
        const response = await paypalClient.get(
            `/v2/checkout/orders/${orderId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: PayPal no respondió a tiempo al obtener los detalles del pedido');
        }
        throw error;
    }
}

async function authorizePayment(orderId) {
    try {
        const accessToken = await getAccessToken();
        const response = await paypalClient.post(
            `/v2/checkout/orders/${orderId}/authorize`, {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: PayPal no respondió a tiempo al autorizar el pago');
        }
        throw error;
    }
}

async function updateOrderAmount(orderId, newTotal, currency = 'USD') {
    try {
        const accessToken = await getAccessToken();
        const response = await paypalClient.patch(
            `/v2/checkout/orders/${orderId}`, [
                {
                    op: 'replace',
                    path: '/purchase_units/@reference_id==\'default\'/amount',
                    value: {
                        currency_code: currency,
                        value: newTotal
                    }
                }
            ], {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
        return response.data;
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            throw new Error('Timeout: PayPal no respondió a tiempo al actualizar el monto de la orden');
        }
        throw error;
    }
}

module.exports = {createOrder, capturePayment, orderDetails, authorizePayment, updateOrderAmount};
