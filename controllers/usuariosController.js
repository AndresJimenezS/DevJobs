const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');


exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crear tu cuenta en devJobs',
        tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {

    // sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    req.sanitizeBody('password').escape();
    req.sanitizeBody('confirmar').escape();

    // Validar
    req.checkBody('nombre', 'El nombre es obligatorio').notEmpty();
    req.checkBody('email', 'El email debe ser valido').isEmail();
    req.checkBody('password', 'El password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'Confirmar password no puede ir vacío').notEmpty();
    req.checkBody('confirmar', 'El password es diferente').equals(req.body.password);

    const errores = req.validationErrors();

    if(errores){
        //si hay errores, se guardan en un flash
        req.flash('error', errores.map(error => error.msg));

        res.render('crear-cuenta', {
            nombrePagina: 'Crear tu cuenta en devJobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return;
    }

    // si toda la validación es correcta
    next();
}


exports.crearUsuario = async (req, res, next) => {
    // crear el usuario
    const usuario = new Usuarios(req.body);

    try{
        await usuario.save();
        res.redirect('/iniciar-sesion');
    }catch(error){
        req.flash('error', error);  //toma el error lanzado desde el Model en usuarioSchema.post
        res.redirect('/crear-cuenta');
    }
}

// Formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina: 'Iniciar Sesión devJobs'
    })
}


// Form editar el perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina: 'Edita tu perfil en devJobs',
        usuarioNombre: req.user.nombre,
        usuarioMail: req.user.email,
        cerrarSesion: true,
        nombre: req.user.nombre
    })
}

//Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id)

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password){
        usuario.password = req.body.password
    }
    await usuario.save();

    req.flash('correcto', 'Cambios Guardados Correctamente');

    //redirect
    res.redirect('/administracion');
}

// Sanitizar y vallidar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    //sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    //validar
    req.checkBody('nombre', 'El nombre no puede ir vacío').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacío').notEmpty();

    const errores = req.validationErrors();

    if(errores){
        req.flash('error', errores.map(error => error.msg));

        res.render('editar-perfil', {
            nombrePagina: 'Edita tu perfil en devJobs',
            usuarioNombre: req.user.nombre,
            usuarioMail: req.user.email,
            cerrarSesion: true,
            nombre: req.user.nombre,
            mensajes: req.flash()
        })

        return;
    }

    next();
}

