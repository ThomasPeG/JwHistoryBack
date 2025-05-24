const Visit = require('../models/Visit');
const User = require('../models/Usuario');

const visitController = {
  // Crear una nueva visita
  createVisit: async (req, res) => {
    try {
      const {
        userId,
        names,
        initialQuestion,
        address,
        personType,
        ownerConcern,
        personalData,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate
      } = req.body;
      console.log(req.body);
      

      // Verificar si el usuario existe
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      const visit = new Visit({
        userId,
        names,
        initialQuestion,
        address,
        personType,
        ownerConcern,
        personalData,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate
      });

      await visit.save();
      res.status(201).json({ message: 'Visita registrada exitosamente', visit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener todas las visitas de un usuario
  getUserVisits: async (req, res) => {
    try {
      const { userId } = req.params;
      const visits = await Visit.find({ userId }).sort({ date: -1 });
      res.json(visits);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Actualizar una visita
  updateVisit: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const visit = await Visit.findByIdAndUpdate(
        id,
        updateData,
        { new: true }
      );

      if (!visit) {
        return res.status(404).json({ message: 'Visita no encontrada' });
      }

      res.json({ message: 'Visita actualizada exitosamente', visit });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Eliminar una visita
  deleteVisit: async (req, res) => {
    try {
      const { id } = req.params;
      const visit = await Visit.findByIdAndDelete(id);

      if (!visit) {
        return res.status(404).json({ message: 'Visita no encontrada' });
      }

      res.json({ message: 'Visita eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
};

module.exports = visitController;