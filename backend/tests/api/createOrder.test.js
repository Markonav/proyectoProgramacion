const request = require('supertest');
const app = require('../../app/app.js');

describe('Pruebas de integración para la API de paypal', () => {

    test("POST api/paypal - debería crear una nueva orden", async () => {
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'marco324@gmail.com',
                password: '123456789m'
            });
        const token = loginRes.body.token;

        const res = await request(app)
            .post('/api/paypal/orders')
            .set('Authorization', `Bearer ${token}`)
            .send({
                total: 50,
                currency: 'USD'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('order');
    });
});