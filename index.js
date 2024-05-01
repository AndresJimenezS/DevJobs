const mongoose = require('mongoose')
require('./config/db');

const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const router = require('./routes');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const createError = require('http-errors');
const passport = require('./config/passport');

require('dotenv').config({ path: 'variables.env'});

const app= express();

// Habilitar bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); //enviar/leer objs desde forms

// validacion de campos
app.use(expressValidator());

// Habilitar handlebars como view
app.engine('handlebars', 
    exphbs.engine({
        defaultLayout:'layout',
        helpers: require('./helpers/handlebars')
    })
);


app.set('view engine', 'handlebars');

// static files
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

//para firmar la sessión
app.use(session({
    secret: process.env.SECRETO,
    key: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE,
        mongooseConnection: mongoose.connection,
        ttl: 24 * 60 * 60
    })
}));

// inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Alertas y flash messages
app.use(flash());

// Crear nuestro middleware de mensajes
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router());

// 404 página no existente
app.use((re, res, next) => {
    next(createError(404, 'No Encontrado'));
})

// Administración de los ERRORES
app.use((error, req, res, next) => {
    res.locals.mensaje = error.message;

    /* Saber si es 404, 403, etc
    const status = error.status || 500;
    res.locals.status = status;
    res.status(status);
    */

    res.render('error');
})

app.listen(process.env.PUERTO);