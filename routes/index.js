const homeController = require('../controllers/homeController'); 
const express = require('express');
const router = express.Router();

module.exports = () => {
    
    router.get('/', homeController.mostrarTrabajos);

    return router;
}