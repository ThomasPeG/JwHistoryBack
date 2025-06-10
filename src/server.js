const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Puedes mantener esta importación para usarla en rutas específicas si lo necesitas
require('dotenv').config();

const app = express(); 

// Middleware personalizado para CORS
app.use((req, res, next) => {
  // Permitir cualquier origen
  res.setHeader("Access-Control-Allow-Origin", "*");
  
  // O si prefieres especificar orígenes concretos:
  // const allowedOrigins = ['http://localhost:8100', 'https://jw-history.netlify.app'];
  // const origin = req.headers.origin;
  // if (allowedOrigins.includes(origin)) {
  //   res.setHeader('Access-Control-Allow-Origin', origin);
  // }
  
  // Permitir métodos HTTP específicos
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  
  // Permitir encabezados específicos
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  
  // Permitir credenciales
  res.setHeader("Access-Control-Allow-Credentials", "true");
  
  // Manejar solicitudes preflight OPTIONS
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }
  
  next();
});

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