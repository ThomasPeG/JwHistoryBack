const Usuario = require('../models/Usuario');
const bcrypt = require('bcrypt');

const authController = {
  // Registro de usuario
  registro: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Verificar si el usuario ya existe
      const usuarioExistente = await Usuario.findOne({ email });
      if (usuarioExistente) {
        return res.status(400).json({ mensaje: 'El correo ya está registrado' });
      }

      // Generar el hash de la contraseña
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      // Crear nuevo usuario con la contraseña hasheada
      const usuario = new Usuario({
        email,
        password: passwordHash
      });
      await usuario.save();

      res.status(201).json({ mensaje: 'Usuario registrado exitosamente' });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  },

  // Inicio de sesión
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Buscar usuario
      const usuario = await Usuario.findOne({ email });
      if (!usuario) {
        return res.status(400).json({ mensaje: 'Credenciales inválidas' });
      }

      // Verificar contraseña usando bcrypt.compare
      const passwordValida = await bcrypt.compare(password, usuario.password);
      if (!passwordValida) {
        return res.status(400).json({ mensaje: 'Credenciales inválidas' });
      }

      res.json({ 
        mensaje: 'Inicio de sesión exitoso',
        usuario: {
          id: usuario._id,
          email: usuario.email
        }
      });
    } catch (error) {
      res.status(500).json({ mensaje: error.message });
    }
  }
};

module.exports = authController;