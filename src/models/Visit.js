const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  amoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amo',
  },
  initialQuestion: {
    type: String,
    default: ''
  },
  ownerConcern: {
    type: String,
    default: ''
  },
  pendingQuestion: {
    type: String,
    default: ''
  },
  duration: {
    type: Number
  },
  notes: {
    type: String
  },
  date: {
    type: Date,
  },
  nextVisitDate: {
    type: Date
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Visit', visitSchema);