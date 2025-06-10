const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express(); 

// Configuración de CORS
app.use(cors({
  origin: ['http://localhost:8100', 'https://jw-history.netlify.app', 'capacitor://*', 'ionic://*'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}));

// Middleware adicional para manejar preflight OPTIONS
app.options('*', cors());

// Middleware para parsear JSON
app.use(express.json());

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const visitRoutes = require('./routes/visitRoutes');
const statsRoutes = require('./routes/statsRoutes');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/amo', visitRoutes);
app.use('/api/stats', statsRoutes);

// Conexión a MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDBs', process.env.MONGODB_URI))
  .catch((error) => console.error('Error de conexión a MongoDB:', error));
// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ mensaje: 'API funcionando correctamente Bien' });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, (i) => {
  console.log(`Servidor corriendo en el puertos ${PORT}`);
});