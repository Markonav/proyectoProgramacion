const { validarCredenciales } = require('../../services/userService.js');

describe('Pruebas unitarias para validarCredenciales', () => {
    test('debería LANZAR ERROR para un correo inválido', () => {
        expect(() => validarCredenciales('correoInvalido', 'Password1')).toThrow('Correo inválido');
    });

    test('debería NO LANZAR ERROR para un correo inválido', () => {
        expect(() => validarCredenciales('correo@valido.com', 'Password1')).not.toThrow();
    });

    test('debería LANZAR ERROR para una contraseña invalida', () => {
        expect(() => validarCredenciales('correo@valido.com', 'Pass')).toThrow('La contraseña debe tener 6+ caracteres con letras y números');
    });

    test('debería NO LANZAR ERROR para una contraseña valida', () => {
        expect(() => validarCredenciales('correo@valido.com', 'Password1')).not.toThrow();
    });
});