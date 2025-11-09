const jwt = require('jsonwebtoken');

const { iniciarToken, verificarToken } = require('../../controllers/authController');

const usuarioEjemplo = {
  email: 'usuario@ejemplo.com',
  password: 'Password1'
};

describe('Pruebas unitarias para authController', () => {

    test('debería iniciar sesión y devolver un token', () => {
        const token = iniciarToken(usuarioEjemplo);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    test('verificarToken deberia decodificar correctamente un token válido', () => {
        const token = iniciarToken(usuarioEjemplo);
        const resultado = verificarToken(token);

        expect(resultado.email).toBe(usuarioEjemplo.email);
        expect(resultado.public_id).toBe(usuarioEjemplo.public_id);
    });

    test('verificarToken deberia lanzar un error para un token inválido', () => {
        expect(() => verificarToken("token-falso")).toThrow();
    });
});