const request = require('supertest');
const app = require('../../app/app.js');
const db = require('../../data/db.js');

describe('Pruebas de integración para la API de registro de usuarios y login', () => {

    test("POST api/users/register - debería registrar un nuevo usuario", async () => {
        const res = await request(app)
            .post('/api/users/register')
            .send({
                email: 'usuario@ejemplo.com',
                password: 'contraseñaSegura1'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Usuario registrado con éxito');
    });

    test("POST api/users/login - debería iniciar sesión con credenciales válidas", async () => {
        const res = await request(app)
            .post('/api/users/login')
            .send({
                email: 'marco324@gmail.com',
                password: '123456789m'
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    afterAll(() => {
        db.prepare('DELETE FROM usuarios WHERE email = ?').run('usuario@ejemplo.com');
    });
});