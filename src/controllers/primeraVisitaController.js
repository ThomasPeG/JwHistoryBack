const PrimeraVisita = require('../models/PrimeraVisita');

const primeraVisitaController = {
  // Crear una nueva primera visita
  crear: async (req, res) => {
    try {
      const nuevaVisita = new PrimeraVisita(req.body);
      const visitaGuardada = await nuevaVisita.save();
      res.status(201).json(visitaGuardada);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  // Obtener todas las primeras visitas
  obtenerTodas: async (req, res) => {
    try {
      const visitas = await PrimeraVisita.find();
      res.json(visitas);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener una visita por ID
  obtenerPorId: async (req, res) => {
    try {
      const visita = await PrimeraVisita.findById(req.params.id);
      if (!visita) {
        return res.status(404).json({ message: 'Visita no encontrada' });
      }
      res.json(visita);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = primeraVisitaController;