const homeController = require('../controllers/homeController'); 
const vacantesController = require('../controllers/vacantesController'); 
const usuariosController = require('../controllers/usuariosController'); 
const authController = require('../controllers/authController'); 
const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
    );
    router.post('/vacantes/nueva',
        authController.verificarUsuario,
        vacantesController.agregarVacante
    );

    // Mostrar vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    // Editar vacante
    router.get('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.formEditarVacante
    );
    router.post('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.editarVacante
    );

    // Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario

    );

    // Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);


    // Panel de administración
    router.get('/administracion',
        authController.verificarUsuario,
        authController.mostrarPanel
    );


    // Editar perfil
    router.get('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.formEditarPerfil
    );

    router.post('/editar-perfil',
        authController.verificarUsuario,
        usuariosController.editarPerfil
    )


    return router;
}