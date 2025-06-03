const mongoose = require('mongoose');

const amoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  names: {
    type: String,
  },
  personType: {
    type: String,
    enum: ['ateo', 'cristiano', 'catolico', 'otro']
  },
  personalData: {
    type: String
  },
  address: {
    type: String,
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'completed'],
    default: 'active'
  },
  visit: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Visit'
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Amo', amoSchema);