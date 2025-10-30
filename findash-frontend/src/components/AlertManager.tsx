import { useEffect, useState } from 'react';
import { alertService } from '../services/api';

export default function AlertManager({ holdingId, symbol }: any) {
  const [alerts, setAlerts] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    alertType: 'PRICE_UP',
    targetPrice: 0,
    percentChange: 5
  });

  useEffect(() => {
    fetchAlerts();
  }, [holdingId]);

  const fetchAlerts = async () => {
    try {
      const response = await alertService.getAlerts(holdingId);
      setAlerts(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreate = async () => {
    try {
      await alertService.createAlert(holdingId, {
        symbol,
        ...formData
      });
      setShowForm(false);
      setFormData({ alertType: 'PRICE_UP', targetPrice: 0, percentChange: 5 });
      fetchAlerts();
    } catch (err) {
      alert('Erreur création alerte');
    }
  };

  const handleDelete = async (alertId: string) => {
    try {
      await alertService.deleteAlert(alertId);
      fetchAlerts();
    } catch (err) {
      alert('Erreur suppression alerte');
    }
  };

  const handleToggle = async (alertId: string) => {
    try {
      await alertService.toggleAlert(alertId);
      fetchAlerts();
    } catch (err) {
      alert('Erreur mise à jour alerte');
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4 mt-3">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold text-sm">
          🔔 Alertes pour {symbol}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
        >
          + Ajouter
        </button>
      </div>

      {showForm && (
        <div className="bg-slate-900/50 p-3 rounded mb-3 space-y-2">
          <select
            value={formData.alertType}
            onChange={(e) => setFormData({ ...formData, alertType: e.target.value })}
            className="w-full bg-slate-700 text-white px-2 py-2 rounded border border-slate-600 text-sm"
          >
            <option value="PRICE_UP">Prix Monte Au-Dessus</option>
            <option value="PRICE_DOWN">Prix Descend En-Dessous</option>
            <option value="PERCENT_CHANGE">Changement %</option>
          </select>

          {formData.alertType !== 'PERCENT_CHANGE' ? (
            <input
              type="number"
              placeholder="Prix cible"
              value={formData.targetPrice}
              onChange={(e) => setFormData({ ...formData, targetPrice: parseFloat(e.target.value) })}
              className="w-full bg-slate-700 text-white px-2 py-2 rounded border border-slate-600 text-sm"
            />
          ) : (
            <input
              type="number"
              placeholder="Changement %"
              value={formData.percentChange}
              onChange={(e) => setFormData({ ...formData, percentChange: parseFloat(e.target.value) })}
              className="w-full bg-slate-700 text-white px-2 py-2 rounded border border-slate-600 text-sm"
            />
          )}

          <div className="flex gap-2">
            <button
              onClick={handleCreate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded text-xs"
            >
              ✅ Créer
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 rounded text-xs"
            >
              ❌ Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {alerts.length === 0 ? (
          <p className="text-slate-400 text-xs">Aucune alerte</p>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert._id}
              className="bg-slate-900/50 p-2 rounded flex items-center justify-between text-xs"
            >
              <div className="flex-1">
                <p className="text-white">
                  {alert.alertType === 'PRICE_UP' && `📈 Prix > ${alert.targetPrice}€`}
                  {alert.alertType === 'PRICE_DOWN' && `📉 Prix < ${alert.targetPrice}€`}
                  {alert.alertType === 'PERCENT_CHANGE' && `📊 Changement > ${alert.percentChange}%`}
                </p>
                <p className="text-slate-400 text-xs">
                  {alert.triggered ? '✅ Déclenchée' : '⏳ En attente'}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <button
                  onClick={() => handleToggle(alert._id)}
                  className={`text-xs ${alert.isActive ? 'text-green-400' : 'text-slate-500'}`}
                >
                  {alert.isActive ? '🟢' : '⚫'}
                </button>
                <button
                  onClick={() => handleDelete(alert._id)}
                  className="text-red-400 hover:text-red-300"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
