import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Plus, LogOut, TrendingUp, TrendingDown, Wallet, Sun, Download, FileText } from 'lucide-react';
import { logout } from '../store/authSlice';
import { portfolioService } from '../services/api';
import ConfirmDialog from '../components/ConfirmDialog';
import { useTheme } from '../context/ThemeContext';
import { exportAllPortfoliosToCSV, exportAllPortfoliosToPDF } from '../utils/exportUtils';

export default function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useSelector((state) => state.auth);
  const [portfolios, setPortfolios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [createDialog, setCreateDialog] = useState({ isOpen: false, name: '' });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, portfolioId: null });
  const [editingPortfolioId, setEditingPortfolioId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchPortfolios();
  }, []);

  const fetchPortfolios = async () => {
    try {
      setLoading(true);
      const response = await portfolioService.getPortfolios();
      setPortfolios(response.data);
    } catch (err) {
      setError('Erreur lors du chargement des portefeuilles');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const handleCreateClick = () => {
    setCreateDialog({ isOpen: true, name: '' });
  };

  const confirmCreate = async () => {
    if (!createDialog.name.trim()) {
      alert('Entrez un nom de portefeuille');
      return;
    }
    try {
      await portfolioService.createPortfolio({ name: createDialog.name });
      setCreateDialog({ isOpen: false, name: '' });
      fetchPortfolios();
    } catch (err) {
      alert('Erreur lors de la création du portefeuille');
      setCreateDialog({ isOpen: false, name: '' });
    }
  };

  const handleDeleteClick = (portfolioId) => {
    setDeleteDialog({ isOpen: true, portfolioId });
  };

  const confirmDelete = async () => {
    try {
      await portfolioService.deletePortfolio(deleteDialog.portfolioId);
      setDeleteDialog({ isOpen: false, portfolioId: null });
      fetchPortfolios();
    } catch (err) {
      console.error('Erreur:', err);
      setDeleteDialog({ isOpen: false, portfolioId: null });
    }
  };

  const savePortfolioName = async (portfolioId) => {
    if (!editingName.trim()) {
      setEditingPortfolioId(null);
      return;
    }
    try {
      await portfolioService.updatePortfolio(portfolioId, { name: editingName });
      setEditingPortfolioId(null);
      fetchPortfolios();
    } catch (err) {
      console.error('Erreur:', err);
      setEditingPortfolioId(null);
    }
  };

  const totalPortfolioValue = portfolios.reduce((sum, p) => sum + (p.totalValue || 0), 0);
  const totalPnL = portfolios.reduce((sum, p) => sum + (p.pnl || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800/50 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              FinDash
            </h1>
            <p className="text-slate-400 text-sm mt-1">Gérez votre portefeuille avec style</p>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => exportAllPortfoliosToCSV(portfolios)}
              className="p-2 rounded-lg hover:bg-slate-800 transition"
              title="Exporter en CSV"
            >
              <Download size={20} className="text-green-400" />
            </button>

            <button
              onClick={() => exportAllPortfoliosToPDF(portfolios)}
              className="p-2 rounded-lg hover:bg-slate-800 transition"
              title="Exporter en PDF"
            >
              <FileText size={20} className="text-red-400" />
            </button>

            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-slate-800 transition"
              title="Changer le thème"
            >
              <Sun size={20} className="text-yellow-400" />
            </button>

            <button
              onClick={handleLogout}
              className="bg-red-600/20 hover:bg-red-600/30 text-red-300 px-4 py-2 rounded-lg flex items-center gap-2 transition border border-red-500/30"
            >
              <LogOut size={18} />
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {portfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Valeur Totale</p>
                <Wallet className="text-blue-400" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">{totalPortfolioValue.toFixed(2)}€</p>
              <p className="text-slate-500 text-xs mt-2">Tous les portefeuilles</p>
            </div>

            <div className={`bg-gradient-to-br ${totalPnL >= 0 ? 'from-green-900/20 to-slate-900' : 'from-red-900/20 to-slate-900'} p-6 rounded-xl border ${totalPnL >= 0 ? 'border-green-700/30' : 'border-red-700/30'} hover:border-opacity-50 transition`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">P&L Total</p>
                {totalPnL >= 0 ? (
                  <TrendingUp className="text-green-400" size={20} />
                ) : (
                  <TrendingDown className="text-red-400" size={20} />
                )}
              </div>
              <p className={`text-3xl font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {totalPnL.toFixed(2)}€
              </p>
              <p className="text-slate-500 text-xs mt-2">Performance globale</p>
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700/50 hover:border-slate-600/50 transition">
              <div className="flex items-center justify-between mb-2">
                <p className="text-slate-400 text-sm font-medium">Portefeuilles</p>
                <Wallet className="text-purple-400" size={20} />
              </div>
              <p className="text-3xl font-bold text-white">{portfolios.length}</p>
              <p className="text-slate-500 text-xs mt-2">Portefeuilles actifs</p>
            </div>
          </div>
        )}

        <div className="mb-8">
          <button
            onClick={handleCreateClick}
            className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition shadow-lg hover:shadow-xl"
          >
            <Plus size={20} />
            Créer un portefeuille
          </button>
        </div>

        {loading && (
          <div className="text-center py-12">
            <div className="inline-block">
              <div className="w-8 h-8 border-3 border-slate-600 border-t-blue-400 rounded-full animate-spin"></div>
            </div>
            <p className="text-slate-400 mt-4">Chargement...</p>
          </div>
        )}

        {error && (
          <div className="bg-red-900/20 border border-red-700/30 text-red-300 p-4 rounded-lg text-center">
            {error}
          </div>
        )}

        {!loading && portfolios.length === 0 && (
          <div className="bg-slate-800/50 border border-slate-700/50 p-12 rounded-xl text-center">
            <Wallet className="mx-auto text-slate-600 mb-4" size={48} />
            <p className="text-slate-400 mb-6">Aucun portefeuille encore. Créez-en un pour commencer !</p>
            <button
              onClick={handleCreateClick}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition"
            >
              Créer votre premier portefeuille
            </button>
          </div>
        )}

        {!loading && portfolios.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolios.map((portfolio) => (
              <div
                key={portfolio.id}
                className="group bg-gradient-to-br from-slate-800/80 to-slate-900/80 rounded-xl border border-slate-700/50 hover:border-blue-500/50 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/10 relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteClick(portfolio.id);
                  }}
                  className="absolute top-3 right-3 bg-red-600/80 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold opacity-0 group-hover:opacity-100 transition z-10"
                >
                  ✕
                </button>

                <div className="p-6 h-full flex flex-col">
                  {editingPortfolioId === portfolio.id ? (
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onBlur={() => savePortfolioName(portfolio.id)}
                      onKeyPress={(e) => e.key === 'Enter' && savePortfolioName(portfolio.id)}
                      className="text-xl font-bold text-white bg-slate-700 px-2 py-1 rounded border border-blue-500 focus:outline-none mb-4"
                      autoFocus
                    />
                  ) : (
                    <h2 
                      onClick={() => {
                        setEditingPortfolioId(portfolio.id);
                        setEditingName(portfolio.name);
                      }}
                      className="text-xl font-bold text-white mb-4 pr-6 group-hover:text-blue-300 transition cursor-pointer hover:bg-slate-800/50 px-2 py-1 rounded"
                    >
                      {portfolio.name}
                    </h2>
                  )}

                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-sm">📊 Actifs</p>
                      <p className="text-white font-semibold">{portfolio.holdings?.length || 0}</p>
                    </div>

                    <div className="h-px bg-slate-700/50"></div>

                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-sm">💰 Valeur</p>
                      <p className="text-blue-300 font-semibold">{(portfolio.totalValue || 0).toFixed(2)}€</p>
                    </div>

                    <div className="h-px bg-slate-700/50"></div>

                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-sm">📈 P&L</p>
                      <p className={(portfolio.pnl || 0) >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {(portfolio.pnl || 0).toFixed(2)}€
                      </p>
                    </div>

                    <div className="flex justify-between items-center">
                      <p className="text-slate-400 text-sm">%</p>
                      <p className={(portfolio.pnlPercent || 0) >= 0 ? 'text-green-400 font-semibold' : 'text-red-400 font-semibold'}>
                        {(portfolio.pnlPercent || 0).toFixed(2)}%
                      </p>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/portfolio/${portfolio.id}`)}
                    type="button"
                    className="mt-6 w-full bg-blue-600/20 hover:bg-blue-600/40 border border-blue-500/30 hover:border-blue-500/60 text-blue-300 hover:text-blue-200 py-2 rounded-lg transition text-sm font-medium"
                  >
                    Consulter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <ConfirmDialog
        isOpen={createDialog.isOpen && !deleteDialog.isOpen}
        title="Créer un portefeuille"
        message="Entrez le nom du portefeuille"
        confirmText="Créer"
        cancelText="Annuler"
        isDangerous={false}
        onConfirm={confirmCreate}
        onCancel={() => setCreateDialog({ isOpen: false, name: '' })}
        hasInput={true}
        inputValue={createDialog.name}
        onInputChange={(value) => setCreateDialog({ ...createDialog, name: value })}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Supprimer le portefeuille ?"
        message="Êtes-vous sûr de vouloir supprimer ce portefeuille ? Tous les actifs seront supprimés. Cette action est irréversible."
        confirmText="Supprimer"
        cancelText="Annuler"
        isDangerous={true}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteDialog({ isOpen: false, portfolioId: null })}
      />
    </div>
  );
}
