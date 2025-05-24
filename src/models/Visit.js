const mongoose = require('mongoose');

const visitSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  names: {
    type: String,
    required: true
  },
  initialQuestion: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  personType: {
    type: String,
    required: true,
    enum: ['ateo', 'cristiano', 'catolico']
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
    type: Number,  // duración en minutos
    required: true
  },
  notes: {
    type: String
  },
  nextVisitDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Visit', visitSchema);