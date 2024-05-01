const passport = require('passport');
const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante');
const Usuarios = mongoose.model('Usuarios');
const crypto = require('crypto');
const enviarEmail = require('../handlers/email');

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

// Form reiniciar password
exports.formRestablecerPassword = (req, res) => {
    res.render('restablecer-password', {
        nombrePagina: 'Restablece tu Password',
        tagline: 'Si ya tienes una cuenta pero olvidaste tu password, coloca tu email'
    })
}
// Genera el Token en tabla usuario
exports.enviarToken = async (req, res) => {
    const usuario = await Usuarios.findOne({ email: req.body.email});

    if(!usuario){
        req.flash('error', 'No existe esa cuenta');
        return res.redirect('/iniciar-sesion');
    }

    // el usuario existe, generar token
    usuario.token = crypto.randomBytes(20).toString('hex');
    usuario.expira = Date.now() + 3600000;

    // Guardar el usuario
    await usuario.save();
    const resetUrl = `http://${req.headers.host}/reestablecer-password/${usuario.token}`;

    //console.log(resetUrl);

    // enviar notificación por email
    await enviarEmail.enviar({
        usuario,
        subject : 'Password Reset',
        resetUrl,
        archivo: 'reset'
    })


    req.flash('correcto', 'Revisa tu email para restablecer password')
    res.redirect('iniciar-sesion');
}


// Valida si el token es válido y el usuario existe, muestra la vista
exports.restablecerPassword = async (req,res) => {
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira : {
            $gt : Date.now()
        }
    });

    if(!usuario){
        req.flash('error', 'El formulario ya no es válido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Todo bien, muestra formulario
    res.render('nuevo-password', {
        nombrePagina : 'Nuevo Password'
    })
}


// Almacena nuevo password en BD
exports.guardarPassword = async(req, res) => {
    const usuario = await Usuarios.findOne({
        token : req.params.token,
        expira : {
            $gt : Date.now()
        }
    });

    // no existe o el token es inválido
    if(!usuario){
        req.flash('error', 'El formulario ya no es válido, intenta de nuevo');
        return res.redirect('/reestablecer-password');
    }

    // Asiganr password, limpiar valores previos y guardar en BD
    usuario.password = req.body.password;
    usuario.token = undefined;
    usuario.expira = undefined;
    await usuario.save();

    // redirigir
    req.flash('correcto', 'Password Modificado Correctamente');
    res.redirect('/iniciar-sesion');
}