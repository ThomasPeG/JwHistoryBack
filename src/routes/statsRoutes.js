const express = require('express');
const router = express.Router();
const visitController = require('../controllers/visitController');

// Rutas para estadísticas (ordenadas de más específica a más genérica)
router.get('/yearly/:userId/:year', visitController.getYearlyStatsSummary);
router.get('/:userId/:year/:month', visitController.getMonthlyStats);
router.get('/:userId/:year', visitController.getMonthlyStats);
router.get('/:userId', visitController.getMonthlyStats);

module.exports = router;