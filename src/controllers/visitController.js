const Amo = require('../models/Amo');
const User = require('../models/Usuario');
const Visit = require('../models/Visit');

const visitController = {
  // Crear un nuevo Amo con su primera visita
  createVisit: async (req, res) => {
    try {
      const { userId } = req.params;
      const {
        // Datos del Amo
        names,
        address,
        personType,
        personalData,
        // Datos de la visita
        initialQuestion,
        ownerConcern,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate,
        date
      } = req.body;
      console.log(req.body);
      
      // Verificar si el usuario existe
      const userExists = await User.findById(userId);
      if (!userExists) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Crear el Amo
      const amo = new Amo({
        userId,
        names,
        address,
        personType,
        personalData
      });

      // Crear la visita
      const visit = new Visit({
        initialQuestion,
        ownerConcern,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate,
        date
      });

      // Guardar la visita
      await visit.save();

      // Agregar el ID de la visita al array de visits del Amo
      amo.visit.push(visit._id);

      // Guardar el Amo
      await amo.save();
      console.log(amo);
      res.status(201).json({ 
        message: 'Amo y visita registrados exitosamente', 
        amo,
        visit 
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener todas las visitas de un usuario
  getUserVisits: async (req, res) => {
    try {
      const { userId } = req.params;
      const amos = await Amo.find({ userId })
        .populate('visit')
        .sort({ createdAt: -1 });
      res.json(amos);
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

      // Eliminar la referencia de la visita en el Amo
      await Amo.updateMany(
        { visit: id },
        { $pull: { visit: id } }
      );

      res.json({ message: 'Visita eliminada exitosamente' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Crear una nueva visita para un Amo existente
  createRevisit: async (req, res) => {
    try {
      const { amoId } = req.params;
      const {
        initialQuestion,
        ownerConcern,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate,
        date
      } = req.body;

      // Verificar si el Amo existe
      const amo = await Amo.findById(amoId);
      console.log(amo);
      if (!amo) {
        return res.status(404).json({ message: 'Amo no encontrado' });
      }

      // Crear la nueva visita
      const visit = new Visit({
        initialQuestion,
        ownerConcern,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate,
        date
      });

      // Guardar la visita
      await visit.save();

      // Agregar el ID de la visita al array de visits del Amo
      amo.visit.push(visit._id);

      // Guardar el Amo actualizado
      await amo.save();

      res.status(201).json({ 
        message: 'Nueva visita registrada exitosamente', 
        visit,
        amo
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = visitController;