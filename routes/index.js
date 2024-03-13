const homeController = require('../controllers/homeController'); 
const vacantesController = require('../controllers/vacantesController'); 
const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);
    router.post('/vacantes/nueva', vacantesController.agregarVacante);

    // Mostrar vacante
    router.get('/vacantes/:url', vacantesController.mostrarVacante);

    return router;
}