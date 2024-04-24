const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');


exports.autenticarUsuario = passport.authenticate('local', {
    successRedirect : '/administracion',
    failureRedirect : '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})


// Revisar si el usuario está autenticado o no
exports.verificarUsuario = (req, res, next) => {
    // Revisar el usuario
    if(req.isAuthenticated()){
        return next();  // estan autenticados
    }

    //  Redireccionar
    res.redirect('/iniciar-sesion');

}


exports.mostrarPanel = async (req, res) => {
    // consultar el usuario autenticado
    const vacantes = await Vacante.find( { autor: req.user._id }).lean();

    res.render('administracion', {
        nombrePagina: 'Panel de Administracion',
        tagline: 'Crea y Administra tus vacantes desde aquí',
        cerrarSesion: true,
        nombre : req.user.nombre,
        imagen: req.user.imagen,
        vacantes
    })
}

exports.cerrarSesion = (req, res) => {
    req.logout(function (err) {
        if(err){
            return next(err);
        }
        req.flash('correcto', 'Cerraste sesión correctamente')
        return res.redirect('/iniciar-sesion');
    });
}