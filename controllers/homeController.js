//importar el Model
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');


exports.mostrarTrabajos = async (req, res, next) => {
    //consulta de todos los registros en base de datos
    const vacantes = await Vacante.find({}).lean();

    if(!vacantes) return next();

    res.render('home', {
        nombrePagina: 'devJobs',
        tagline: 'Encuentra y Publica Trabajos para Desarrolladores Web',
        barra: true,
        boton: true,
        vacantes
    })
}