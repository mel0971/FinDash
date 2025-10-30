import { Router } from 'express';
import authMiddleware from '../middleware/authMiddleware';

import { Alert } from '../models/Alert';

const router = Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { holdingId, symbol, alertType, targetPrice, percentChange } = req.body;
    
    const alert = await Alert.create({
      userId: (req as any).user.id,
      holdingId,
      symbol,
      alertType,
      targetPrice,
      percentChange,
      isActive: true
    });

    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Erreur création alerte' });
  }
});

// Récupérer TOUTES les alertes
router.get('/', authMiddleware, async (req, res) => {
  try {
    const alerts = await Alert.find({ userId: (req as any).user.id });
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération alertes' });
  }
});

// Récupérer UNE alerte
router.get('/:alertId', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Erreur récupération alerte' });
  }
});


// Supprimer une alerte
router.delete('/:alertId', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findByIdAndDelete(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }
    res.json({ message: 'Alerte supprimée' });
  } catch (err) {
    res.status(500).json({ error: 'Erreur suppression alerte' });
  }
});


// Activer/Désactiver une alerte
router.patch('/:alertId/toggle', authMiddleware, async (req, res) => {
  try {
    const alert = await Alert.findById(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ error: 'Alerte non trouvée' });
    }
    alert.isActive = !alert.isActive;
    await alert.save();
    res.json(alert);
  } catch (err) {
    res.status(500).json({ error: 'Erreur mise à jour alerte' });
  }
});


export default router;
