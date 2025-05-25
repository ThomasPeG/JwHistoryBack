const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v) {
        return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v);
      },
      message: props => `${props.value} no es un email válido!`
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  rol: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  activo: {
    type: Boolean,
    default: true
  },
  amo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amo'
  }]
}, {
  timestamps: true // Esto añadirá createdAt y updatedAt automáticamente
});

// Middleware para encriptar la contraseña antes de guardar
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);