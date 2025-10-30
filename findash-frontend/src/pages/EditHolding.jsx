import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { holdingsService } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';


export default function EditHolding() {
  const { portfolioId, holdingId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ symbol: '', assetType: 'STOCK', quantity: '', averagePrice: '' });
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    fetchHolding();
  }, [holdingId]);


  const fetchHolding = async () => {
    try {
      const response = await holdingsService.getHoldings(portfolioId);
      const holding = response.data.find(h => h.id === holdingId);
      if (holding) {
        setFormData({
          symbol: holding.symbol,
          assetType: holding.assetType,  // ← Changez type en assetType
          quantity: holding.quantity.toString(),
          averagePrice: holding.averagePrice.toString(),
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  const handleSubmitClick = (e) => {
    e.preventDefault();
    if (!formData.symbol || !formData.assetType || !formData.quantity || !formData.averagePrice) {
      alert('Tous les champs sont obligatoires');
      return;
    }
    setConfirmDialog(true);
  };


  const confirmUpdate = async () => {
    try {
      setLoading(true);
      await holdingsService.updateHolding(holdingId, {
        symbol: formData.symbol.toUpperCase(),
        type: formData.assetType,  // ← Mappez assetType vers type
        quantity: parseFloat(formData.quantity),
        averagePrice: parseFloat(formData.averagePrice),
      });
      setConfirmDialog(false);
      navigate(`/portfolio/${portfolioId}`);
    } catch (err) {
      console.error(err.response?.data);
      alert('Erreur lors de la modification');
    } finally {
      setLoading(false);
    }
  };


  if (loading && !formData.symbol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center">
        <p className="text-white">Chargement...</p>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/portfolio/${portfolioId}`)}
            className="text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Modifier un actif</h1>
            <p className="text-slate-400 text-sm">Modifiez les détails de votre actif</p>
          </div>
        </div>
      </header>


      <main className="max-w-2xl mx-auto px-6 py-12">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-8">
          <form onSubmit={handleSubmitClick} className="space-y-6">
            <div>
              <label className="block text-white font-semibold mb-2">Symbole</label>
              <input
                type="text"
                name="symbol"
                value={formData.symbol}
                onChange={handleChange}
                placeholder="Ex: AAPL"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-white font-semibold mb-2">Type d'actif</label>
              <select
                name="assetType"
                value={formData.assetType}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:border-blue-500"
              >
                <option value="STOCK">Action</option>
                <option value="ETF">ETF</option>
                <option value="CRYPTO">Crypto</option>
              </select>
            </div>


            <div>
              <label className="block text-white font-semibold mb-2">Quantité</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>


            <div>
              <label className="block text-white font-semibold mb-2">Prix d'achat moyen (€)</label>
              <input
                type="number"
                name="averagePrice"
                value={formData.averagePrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
              />
            </div>


            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={() => navigate(`/portfolio/${portfolioId}`)}
                className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg font-semibold transition"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
              >
                {loading ? 'Modification...' : 'Modifier'}
              </button>
            </div>
          </form>
        </div>
      </main>


      <ConfirmDialog
        isOpen={confirmDialog}
        title="Modifier l'actif ?"
        message={`Êtes-vous sûr de vouloir modifier ${formData.symbol.toUpperCase()} ?`}
        confirmText="Modifier"
        cancelText="Annuler"
        isDangerous={false}
        onConfirm={confirmUpdate}
        onCancel={() => setConfirmDialog(false)}
      />
    </div>
  );
}
