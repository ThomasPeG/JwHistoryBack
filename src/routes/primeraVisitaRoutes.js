const express = require('express');
const router = express.Router();
const primeraVisitaController = require('../controllers/primeraVisitaController');

// Rutas para primera visita
router.post('/', primeraVisitaController.crear);
router.get('/', primeraVisitaController.obtenerTodas);
router.get('/:id', primeraVisitaController.obtenerPorId);

module.exports = router;