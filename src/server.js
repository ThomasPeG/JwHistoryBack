const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:4200', 'https://jwhistory.netlify.app'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const visitRoutes = require('./routes/visitRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/amo', visitRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDBs', process.env.MONGODB_URI))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));
// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente' });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, (i) => {
  console.log(`Servidor corriendo en el puertos ${PORT}`);
});