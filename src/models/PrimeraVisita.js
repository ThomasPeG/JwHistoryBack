const mongoose = require('mongoose');

const primeraVisitaSchema = new mongoose.Schema({
  fecha: {
    type: Date,
    required: true
  },
  nombres: {
    type: String,
    required: true
  },
  preguntaInicial: {
    type: String,
    required: true
  },
  direccion: {
    type: String,
    required: true
  },
  tipoPersona: {
    type: String,
    enum: ['ateo', 'cristiano', 'catolico'],
    required: true
  },
  inquietudAmo: {
    type: String
  },
  datosPersonales: {
    type: String
  },
  preguntaPendiente: {
    type: String
  },
  duracion: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PrimeraVisita', primeraVisitaSchema);