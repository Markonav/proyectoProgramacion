const { cambiarContrasena } = require('../../services/userService.js');



describe('Pruebas unitarias para cambiarContrasena', () => {
    test('debería cambiar la contraseña del usuario', () => {
        const usuarioEjemplo = {
            email: 'usuario@ejemplo.com',
            password: 'Password1',
            currentPassword: 'Password2'
        };
        const resultado = cambiarContrasena(usuarioEjemplo);
        expect(resultado).toBe(true);
    });

    test('debería lanzar un error si la contraseña actual es incorrecta', () => {
        const usuarioEjemplo = {
            email: 'usuario@ejemplo.com',
            password: 'Password1',
            currentPassword: 'Password1'
        };
        expect(() => cambiarContrasena(usuarioEjemplo)).toThrow();
    });
});