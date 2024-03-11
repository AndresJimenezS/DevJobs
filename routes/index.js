const homeController = require('../controllers/homeController'); 
const vacantesController = require('../controllers/vacantesController'); 
const express = require('express');
const router = express.Router();

module.exports = () => {
    router.get('/', homeController.mostrarTrabajos);

    //Crear vacantes
    router.get('/vacantes/nueva', vacantesController.formularioNuevaVacante);

    return router;
}