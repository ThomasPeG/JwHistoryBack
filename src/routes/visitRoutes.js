const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

// Rutas para las visitas
router.post('/revisit/:amoId', visitController.createVisitAmoById); // More specific route first
router.get('/one/:amoId', visitController.getAmoById); // Nueva ruta para obtener un amo por ID
router.post('/:userId', visitController.createAmoByUserId);
router.get('/all/:userId', visitController.getAmosByUserId);
router.put('/:id', visitController.updateAmo);
router.delete('/:id', visitController.deleteAmo);

module.exports = router;