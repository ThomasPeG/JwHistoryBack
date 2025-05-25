const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

// Rutas para las visitas
router.post('/:userId', visitController.createVisit);
router.get('/:userId', visitController.getUserVisits);
router.put('/:id', visitController.updateVisit);
router.delete('/:id', visitController.deleteVisit);
router.post('/:userId/revisit/:amoId', visitController.createRevisit);

module.exports = router;