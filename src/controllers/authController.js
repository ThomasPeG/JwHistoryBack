const User = require('../models/Usuario');
const bcrypt = require('bcrypt');

const authController = {
  // Registro de usuario
  registro: async (req, res) => {
    try {
      const { email, password, name } = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await User.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ message: 'El correo ya está registrado', usuarioExistente });
      }
      const user = new User({
        email,
        password,
        name
      });
      await user.save();

      console.log("Bieeeeeeeeeeen")
      res.status(201).json({ message: 'Usuario registrado exitosamente',
        user
       });
    } catch (error) {
      console.log("errorrrrrrrrrrr")
      res.status(500).json({ message: error.message });
    }
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      // Verificar contraseña usando bcrypt.compare
      const passwordValida = await bcrypt.compare(password, user.password);
      if (!passwordValida) {
        return res.status(400).json({ message: 'Credenciales inválidas' });
      }

      res.json({ 
        mensaje: 'Inicio de sesión exitoso',
        user
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = authController;