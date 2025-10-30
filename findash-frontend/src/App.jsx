import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import AddHolding from './pages/AddHolding';
import EditHolding from './pages/EditHolding';

function AppContent() {
  const { token } = useSelector((state) => state.auth);

  return (
    <Router>
      <Routes>
        {/* Routes publiques */}
        <Route path="/login" element={token ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={token ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Routes protégées */}
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/portfolio/:portfolioId" element={token ? <Portfolio /> : <Navigate to="/login" />} />
        <Route path="/add-holding/:portfolioId" element={token ? <AddHolding /> : <Navigate to="/login" />} />
        <Route path="/edit-holding/:portfolioId/:holdingId" element={token ? <EditHolding /> : <Navigate to="/login" />} />

        {/* Redirection par défaut */}
        <Route path="/" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
