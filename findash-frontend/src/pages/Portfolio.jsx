import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Download, FileText } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { portfolioService, holdingsService } from '../services/api';
import AlertManager from '../components/AlertManager';  // ✅ IMPORT
import ConfirmDialog from '../components/ConfirmDialog';
import Toast from '../components/Toast';
import { exportPortfolioToCSV, exportPortfolioToPDF } from '../utils/exportUtils';

export default function Portfolio() {
  const { portfolioId } = useParams();
  const navigate = useNavigate();
  const [portfolio, setPortfolio] = useState(null);
  const [holdings, setHoldings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, holdingId: null });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchPortfolio();
    fetchHoldings();
  }, [portfolioId]);

  const fetchPortfolio = async () => {
    try {
      const response = await portfolioService.getPortfolios();
      const p = response.data.find(p => p.id === portfolioId);
      setPortfolio(p);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHoldings = async () => {
    try {
      setLoading(true);
      const response = await holdingsService.getHoldings(portfolioId);
      setHoldings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (holdingId) => {
    setDeleteDialog({ isOpen: true, holdingId });
  };

  const confirmDelete = async () => {
    try {
      await holdingsService.deleteHolding(deleteDialog.holdingId);
      setDeleteDialog({ isOpen: false, holdingId: null });
      setToast({ message: '✅ Actif supprimé avec succès !', type: 'success' });
      fetchHoldings();
      fetchPortfolio();
    } catch (err) {
      setToast({ message: '❌ Erreur lors de la suppression', type: 'error' });
      setDeleteDialog({ isOpen: false, holdingId: null });
    }
  };

  const totalValue = portfolio?.totalValue || 0;
  const totalPnL = portfolio?.pnl || 0;
  const pnlPercent = portfolio?.pnlPercent || 0;

  const pieData = holdings.map(h => ({
    name: h.symbol,
    value: parseFloat((h.quantity * h.averagePrice).toFixed(2))
  }));

  const chartData = [
    { date: '1/10', valeur: totalValue * 0.95 },
    { date: '5/10', valeur: totalValue * 0.97 },
    { date: '10/10', valeur: totalValue * 0.99 },
    { date: '15/10', valeur: totalValue * 1.01 },
    { date: '20/10', valeur: totalValue * 1.02 },
    { date: 'Auj', valeur: totalValue }
  ];

  const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#ef4444', '#6366f1'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-slate-400 hover:text-white transition flex-shrink-0"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">{portfolio?.name}</h1>
              <p className="text-slate-400 text-xs sm:text-sm">Portfolio Management</p>
            </div>
          </div>
          
          {portfolio && (
            <div className="flex gap-2">
              <button
                onClick={() => exportPortfolioToCSV(portfolio)}
                className="flex items-center gap-2 bg-green-600/20 hover:bg-green-600/30 border border-green-500/30 text-green-300 px-3 py-2 rounded-lg transition text-sm"
                title="Exporter en CSV"
              >
                <Download size={18} />
                <span className="hidden sm:inline">CSV</span>
              </button>
              <button
                onClick={() => exportPortfolioToPDF(portfolio)}
                className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 px-3 py-2 rounded-lg transition text-sm"
                title="Exporter en PDF"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">PDF</span>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 sm:p-6 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs sm:text-sm mb-2">Valeur Totale</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">{totalValue.toFixed(2)}€</p>
            <p className="text-slate-500 text-xs mt-2 sm:mt-3">Tous les actifs</p>
          </div>

          <div className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-900/20 to-slate-900' : 'from-red-900/20 to-slate-900'} p-4 sm:p-6 rounded-xl border ${totalPnL >= 0 ? 'border-green-700/30' : 'border-red-700/30'}`}>
            <p className="text-slate-400 text-xs sm:text-sm mb-2">Performance</p>
            <p className={`text-2xl sm:text-4xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {totalPnL.toFixed(2)}€
            </p>
            <p className={`text-xs mt-2 sm:mt-3 ${totalPnL >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {pnlPercent.toFixed(2)}%
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-4 sm:p-6 rounded-xl border border-slate-700/50">
            <p className="text-slate-400 text-xs sm:text-sm mb-2">Actifs</p>
            <p className="text-2xl sm:text-4xl font-bold text-white">{holdings.length}</p>
            <p className="text-slate-500 text-xs mt-2 sm:mt-3">Positions ouvertes</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6">
            <h3 className="text-white font-semibold mb-4 text-sm sm:text-base">Répartition Actifs</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" labelLine={false} label={({ name }) => `${name}`} outerRadius={80} fill="#8884d8" dataKey="value">
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(2)}€`} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-slate-400 text-center py-12 text-sm">Aucun actif</p>
            )}
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-2">
              <h3 className="text-white font-semibold text-sm sm:text-base">Performance</h3>
              <span className="text-xs bg-amber-900/30 text-amber-300 px-2 py-1 rounded w-fit">
                Simulé
              </span>
            </div>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                <XAxis dataKey="date" stroke="#999" tick={{ fontSize: 12 }} />
                <YAxis stroke="#999" tick={{ fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #444' }} />
                <Line type="monotone" dataKey="valeur" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-slate-700/50 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <h3 className="text-white font-semibold text-base sm:text-lg">Mes Actifs</h3>
            <button
              onClick={() => navigate(`/add-holding/${portfolioId}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center sm:justify-start gap-2 transition text-sm sm:text-base w-full sm:w-auto"
            >
              <Plus size={18} />
              <span>Ajouter</span>
            </button>
          </div>

          {loading ? (
            <p className="text-slate-400 text-center py-8 text-sm">Chargement...</p>
          ) : holdings.length === 0 ? (
            <p className="text-slate-400 text-center py-8 text-sm">Aucun actif. Ajoutez-en un !</p>
          ) : (
            <>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-left text-slate-300 font-semibold text-xs sm:text-sm">Symbole</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 font-semibold text-xs sm:text-sm">Quantité</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 font-semibold text-xs sm:text-sm">Prix</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 font-semibold text-xs sm:text-sm">Valeur</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 font-semibold text-xs sm:text-sm">%</th>
                      <th className="px-4 py-3 sm:px-6 sm:py-4 text-center text-slate-300 font-semibold text-xs sm:text-sm">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {holdings.map((holding) => {
                      const valeur = holding.quantity * holding.averagePrice;
                      const percent = totalValue > 0 ? (valeur / totalValue) * 100 : 0;
                      return (
                        <tr key={holding.id} className="border-t border-slate-700/30 hover:bg-slate-800/30 transition">
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-white font-semibold text-sm">{holding.symbol}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 text-sm">{holding.quantity}</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 text-sm">{holding.averagePrice.toFixed(2)}€</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-right text-blue-400 font-semibold text-sm">{valeur.toFixed(2)}€</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-right text-slate-300 text-sm">{percent.toFixed(1)}%</td>
                          <td className="px-4 py-3 sm:px-6 sm:py-4 text-center flex gap-2 justify-center">
                            <button
                              onClick={() => navigate(`/edit-holding/${portfolioId}/${holding.id}`)}
                              className="text-blue-400 hover:text-blue-300 transition text-lg"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleDeleteClick(holding.id)}
                              className="text-red-400 hover:text-red-300 transition"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="md:hidden p-3 sm:p-4 space-y-4">
                {holdings.map((holding) => {
                  const valeur = holding.quantity * holding.averagePrice;
                  const percent = totalValue > 0 ? (valeur / totalValue) * 100 : 0;
                  return (
                    <div key={holding.id} className="bg-slate-900/50 p-3 sm:p-4 rounded-lg border border-slate-700/50 space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <span className="text-slate-400 text-xs">Symbole</span>
                          <p className="text-white font-bold text-lg">{holding.symbol}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-slate-400 text-xs">Valeur</span>
                          <p className="text-blue-400 font-semibold">{valeur.toFixed(2)}€</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-slate-400">Quantité</p>
                          <p className="text-white font-semibold text-sm">{holding.quantity}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Prix Unit.</p>
                          <p className="text-white font-semibold text-sm">{holding.averagePrice.toFixed(2)}€</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Pourcentage</p>
                          <p className="text-white font-semibold text-sm">{percent.toFixed(1)}%</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Type</p>
                          <p className="text-white font-semibold text-sm">{holding.assetType}</p>
                        </div>
                      </div>

                      {/* ✅ ALERTMANAGER POUR CHAQUE HOLDING */}
                      <AlertManager 
                        holdingId={holding.id} 
                        symbol={holding.symbol} 
                      />

                      <div className="flex gap-2 pt-2">
                        <button
                          onClick={() => navigate(`/edit-holding/${portfolioId}/${holding.id}`)}
                          className="flex-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 py-2 rounded transition text-xs font-medium"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteClick(holding.id)}
                          className="flex-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 py-2 rounded transition text-xs font-medium"
                        >
                          🗑️ Supprimer
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>

      {toast && <Toast {...toast} onClose={() => setToast(null)} />}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Supprimer l'actif ?"
        message="Êtes-vous sûr de vouloir supprimer cet actif ? Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, holdingId: null })}
      />
    </div>
  );
}
