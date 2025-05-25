const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  amoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amo',
  },
  initialQuestion: {
    type: String
  },
  ownerConcern: {
    type: String
  },
  personalData: {
    type: String
  },
  pendingQuestion: {
    type: String
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