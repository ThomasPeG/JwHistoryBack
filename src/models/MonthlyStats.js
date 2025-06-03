const mongoose = require('mongoose');

const monthlyStatsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  month: {
    type: Number,  // 1-12 para representar los meses
    required: true
  },
  totalVisits: {
    type: Number,
    default: 0
  },
  totalRevisits: {
    type: Number,
    default: 0
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  // Podemos añadir más métricas si es necesario
  visitDetails: [{
    visitId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Visit'
    },
    amoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Amo'
    },
    duration: Number,
    date: Date,
    isRevisit: Boolean
  }]
}, {
  timestamps: true
});

// Índice compuesto para búsquedas eficientes por usuario, año y mes
monthlyStatsSchema.index({ userId: 1, year: 1, month: 1 }, { unique: true });

module.exports = mongoose.model('MonthlyStats', monthlyStatsSchema);