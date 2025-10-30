import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading, error } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Les mots de passe ne correspondent pas');
      return;
    }

    try {
      await register(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
      <div className="bg-primary p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-white mb-6">FinDash</h1>
        <p className="text-gray-400 mb-8">Créer votre compte</p>

        {error && (
          <div className="bg-red-500 text-white p-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Nom</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-secondary text-white p-3 rounded border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Votre nom"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full bg-secondary text-white p-3 rounded border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="votre@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full bg-secondary text-white p-3 rounded border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Minimum 6 caractères"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Confirmer mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-secondary text-white p-3 rounded border border-gray-600 focus:border-accent focus:outline-none"
              placeholder="Confirmer votre mot de passe"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white py-3 rounded font-bold hover:bg-blue-600 disabled:bg-gray-600 transition"
          >
            {isLoading ? 'Inscription...' : 'S\'inscrire'}
          </button>
        </form>

        <p className="text-gray-400 text-center mt-4">
          Déjà inscrit ? <a href="/login" className="text-accent hover:underline">Se connecter</a>
        </p>
      </div>
    </div>
  );
}
