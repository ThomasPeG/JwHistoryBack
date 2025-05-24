const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

// Rutas para las visitas
router.post('/', visitController.createVisit);
router.get('/user/:userId', visitController.getUserVisits);
router.put('/:id', visitController.updateVisit);
router.delete('/:id', visitController.deleteVisit);

module.exports = router;