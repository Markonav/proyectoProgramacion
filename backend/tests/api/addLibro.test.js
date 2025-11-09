const request = require('supertest');
const app = require('../../app/app.js');
const db = require('../../data/db.js');

describe('Pruebas de integracion para la API de creacion de libros', () => {

    test("POST api/libros - debería crear un nuevo libro", async () => {
        const loginRes = await request(app)
            .post('/api/users/login')
            .send({
                email: 'marco324@gmail.com',
                password: '123456789m'
            });
        
        const token = loginRes.body.token;

        const res = await request(app)
            .post('/api/libros')
            .set('Authorization', `Bearer ${token}`)
            .send({
                titulo: 'Nuevo Libro de Prueba',
                autor: 'Autor de Prueba',
                categoria: 'Ficción',
                PrecioRenta: 100,
                sinopsis: 'Sinopsis del libro de prueba'
            });
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'Libro agregado');
    });

    afterAll(() => {
        db.prepare('DELETE FROM libros WHERE titulo = ?').run('Nuevo Libro de Prueba');
    });

});