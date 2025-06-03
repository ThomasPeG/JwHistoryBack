const Amo = require('../models/Amo');
const User = require('../models/Usuario');
const Visit = require('../models/visit');
const MonthlyStats = require('../models/MonthlyStats');

// Función auxiliar para actualizar estadísticas mensuales


const visitController = {
  // Crear un nuevo Amo con su primera visita
  createAmoByUserId: async (req, res) => {
    try {
      const { userId } = req.params;
      const {
        // Datos del Amo
        names,
        address,
        personType,
        personalData,
        // Datos de la visita
        visit
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
      const visita = new Visit({
        initialQuestion : visit.initialQuestion,
        ownerConcern : visit.ownerConcern,
        pendingQuestion : visit.pendingQuestion,
        duration : visit.duration,
        notes : visit.notes,
        nextVisitDate : visit.nextVisitDate,
        date : visit.date,
        amoId: amo._id
      });
      
      // En la función createAmoByUserId, después de guardar la visita:
      await visita.save();
      
      // Actualizar estadísticas mensuales
      await updateMonthlyStats(visita, userId, amo._id, false);
      
      // Agregar el ID de la visita al array de visits del Amo
      amo.visit.push(visita._id);
      
      // Guardar el Amo
      await amo.save();

      res.status(201).json({ 
        message: 'Amo y visita registrados exitosamente', 
        amo
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener todas las visitas de un usuario
  getAmosByUserId: async (req, res) => {
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
  updateAmo: async (req, res) => {
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
  deleteAmo: async (req, res) => {
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
  createVisitAmoById: async (req, res) => {
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
      if (!amo) {
        return res.status(404).json({ message: 'Amo no encontrado' });
      }

      // Crear la nueva visita
      const visit = new Visit({
        amoId : amo._id,
        initialQuestion,
        ownerConcern,
        pendingQuestion,
        duration,
        notes,
        nextVisitDate,
        date
      });

      // En la función createVisitAmoById, después de guardar la visita:
      await visit.save();
      
      // Actualizar estadísticas mensuales
      await updateMonthlyStats(visit, amo.userId, amoId, true);

      // Agregar el ID de la visita al array de visits del Amo
      amo.visit.push(visit._id);

      // Guardar el Amo actualizado
      await amo.save();

      res.status(201).json({ 
        message: 'Nueva visita registrada exitosamente', 
        visit
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener un Amo por su ID
  getAmoById: async (req, res) => {
    try {
      const { amoId } = req.params;
      
      // Buscar el Amo por su ID y popular las visitas relacionadas
      const amo = await Amo.findById(amoId).populate('visit');
      
      if (!amo) {
        return res.status(404).json({ message: 'Amo no encontrado' });
      }
      
      res.json(amo);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },



  // Obtener estadísticas mensuales para un usuario
  getMonthlyStats: async (req, res) => {
    try {
      const { userId, year, month } = req.params;
      
      let query = { userId };
      
      if (year) {
        query.year = parseInt(year);
      }
      
      if (month) {
        query.month = parseInt(month);
      }
      const stats = await MonthlyStats.find(query).sort({ year: -1, month: -1 });
      
      res.json(stats[0]);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  },

  // Obtener resumen de estadísticas anuales
  getYearlyStatsSummary: async (req, res) => {
    try {
      const { userId, year } = req.params;
      
      const stats = await MonthlyStats.find({ userId, year: parseInt(year) })
        .sort({ month: 1 });
      
      // Calcular totales anuales
      const yearlyTotal = {
        totalVisits: 0,
        totalRevisits: 0,
        totalMinutes: 0,
        monthlyBreakdown: []
      };
      
      stats.forEach(month => {
        yearlyTotal.totalVisits += month.totalVisits;
        yearlyTotal.totalRevisits += month.totalRevisits || 0;
        yearlyTotal.totalMinutes += month.totalMinutes;
        
        yearlyTotal.monthlyBreakdown.push({
          month: month.month,
          visits: month.totalVisits,
          revisits: month.totalRevisits || 0,
          minutes: month.totalMinutes
        });
      });
      
      res.json(yearlyTotal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }
};
const updateMonthlyStats = async (visit, userId, amoId, isRevisit = false) => {
  try {
    const visitDate = new Date(visit.date);
    const year = visitDate.getFullYear();
    const month = visitDate.getMonth() + 1; // getMonth() devuelve 0-11
    
    // Buscar o crear estadísticas para este mes
    let monthlyStats = await MonthlyStats.findOne({ userId, year, month });
    
    if (!monthlyStats) {
      monthlyStats = new MonthlyStats({
        userId,
        year,
        month,
        totalVisits: 0,
        totalRevisits: 0,
        totalMinutes: 0,
        visitDetails: []
      });
    }
    
    // Actualizar estadísticas según si es primera visita o revisita
    if (isRevisit) {
      // Si es una revisita, incrementar totalRevisits
      monthlyStats.totalRevisits += 1;
    } else {
      // Si es primera visita, incrementar totalVisits
      monthlyStats.totalVisits += 1;
    }
    
    // Actualizar la duración total en cualquier caso
    monthlyStats.totalMinutes += visit.duration || 0;
    
    // Añadir detalles de la visita
    monthlyStats.visitDetails.push({
      visitId: visit._id,
      amoId,
      duration: visit.duration || 0,
      date: visit.date,
      isRevisit
    });
    
    await monthlyStats.save();
    return monthlyStats;
  } catch (error) {
    console.error('Error al actualizar estadísticas mensuales:', error);
    throw error;
  }
};
module.exports = visitController;