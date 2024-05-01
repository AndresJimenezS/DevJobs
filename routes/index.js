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
        vacantesController.validarVacante,
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
        vacantesController.validarVacante,
        vacantesController.editarVacante
    );

    // Eliminar Vacantes
    router.delete('/vacantes/eliminar/:id',
        vacantesController.eliminarVacante
    )


    // Crear cuentas
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', 
        usuariosController.validarRegistro,
        usuariosController.crearUsuario

    );

    // Autenticar Usuarios
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);
    // Cerrar sesión
    router.get('/cerrar-sesion', 
        authController.verificarUsuario,
        authController.cerrarSesion
    );

    // Reset password (email)
    router.get('/reestablecer-password',
    authController.formRestablecerPassword);
    router.post('/reestablecer-password', authController.enviarToken);

    // Reset password (almacenar en BD)
    router.get('/reestablecer-password/:token', authController.restablecerPassword);
    router.post('/reestablecer-password/:token', authController.guardarPassword);

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
        //usuariosController.validarPerfil,
        usuariosController.subirImagen,
        usuariosController.editarPerfil
    )

    // Recibir msjs de canditados
    router.post('/vacantes/:url', 
        vacantesController.subirCV,
        vacantesController.contactar
    );


    // Muestra candidatos por vacante
    router.get('/candidatos/:id',
        authController.verificarUsuario,
        vacantesController.mostrarCandidatos
    )

    return router;
}