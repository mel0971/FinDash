import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { validators } from '../utils/validators';
import { AlertCircle } from 'lucide-react';


export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [fieldErrors, setFieldErrors] = useState({}); // ← Ajout


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Validation en temps réel
    if (fieldErrors[name]) {
      const validation = validators[name](value);
      if (validation.isValid) {
        setFieldErrors({ ...fieldErrors, [name]: null });
      }
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = {};

    // Validation email
    const emailVal = validators.email(formData.email);
    if (!emailVal.isValid) errors.email = emailVal.error;

    // Validation password
    const passVal = validators.password(formData.password);
    if (!passVal.isValid) errors.password = passVal.error;

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Login failed:', err);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4">
      <div className="bg-slate-900 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-2">FinDash</h1>
        <p className="text-slate-400 mb-6 text-sm">Connexion à votre portefeuille</p>

        {error && (
          <div className="bg-red-900/30 border border-red-700 text-red-200 p-3 rounded mb-4 flex items-center gap-2 text-sm">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full bg-slate-800 text-white p-3 rounded border transition text-sm ${
                fieldErrors.email 
                  ? 'border-red-500' 
                  : 'border-slate-600 focus:border-blue-500'
              } focus:outline-none`}
              placeholder="votre@email.com"
            />
            {fieldErrors.email && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
            )}
          </div>

          <div>
            <label className="block text-slate-300 mb-2 text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full bg-slate-800 text-white p-3 rounded border transition text-sm ${
                fieldErrors.password 
                  ? 'border-red-500' 
                  : 'border-slate-600 focus:border-blue-500'
              } focus:outline-none`}
              placeholder="Votre mot de passe"
            />
            {fieldErrors.password && (
              <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white py-3 rounded font-semibold transition text-sm"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>

        <p className="text-slate-400 text-center mt-4 text-sm">
          Pas de compte ? <a href="/register" className="text-blue-400 hover:underline">S'inscrire</a>
        </p>
      </div>
    </div>
  );
}
