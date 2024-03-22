const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const slug = require('slug');   //generar URLS
const shortid = require('shortid'); //id únicos vacantes

// Esquema
const vacantesSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: 'El nombre de la vacantes es obligatorio',
        trim: true
    },
    empresa: {
        type: String,
        trim: true
    },
    ubicacion: {
        type: String,
        trim: true,
        required: 'La ubicación es obligatoria'
    },
    salario: {
        type: String,
        default: 0,
        trim: true
    },
    contrato: {
        type: String,
        trim: true
    },
    descripcion: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        lowercase: true
    },
    skills: [String],
    candidatos: [{
        nombre: String,
        email: String,
        cv: String
    }],
    autor: {
        type: mongoose.Schema.ObjectId,
        ref: 'Usuarios',
        required: 'El autor es obligatorio'
    }

});//middleware; se ejecuta antes de guardar
vacantesSchema.pre('save', function(next) {

    // crear la url
    const url = slug(this.titulo); //React Dev pasa a ser react-dev
    this.url = `${url}-${shortid.generate()}`; //id único al final

    next();
})

// Creación del esquema Vacante
module.exports = mongoose.model('Vacante', vacantesSchema);


