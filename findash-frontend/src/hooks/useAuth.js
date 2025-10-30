import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginError, logout } from '../store/authSlice';
import { authService } from '../services/api';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, token, isLoading, error } = useSelector((state) => state.auth);

  const register = async (email, password, name) => {
  dispatch(loginStart());
  try {
    const response = await authService.register({
      email,
      password,
      name,
    });
    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Erreur lors de l\'inscription';
    dispatch(loginError(errorMsg));
    throw err;
  }
};


  const login = async (email, password) => {
  dispatch(loginStart());
  try {
    const response = await authService.login({
      email,
      password,
    });
    dispatch(loginSuccess(response.data));
    localStorage.setItem("token", response.data.token);
    return response.data;
  } catch (err) {
    const errorMsg = err.response?.data?.message || 'Erreur lors de la connexion';
    dispatch(loginError(errorMsg));
    throw err;
  }
};


  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    user,
    token,
    isLoading,
    error,
    register,
    login,
    logout: handleLogout,
  };
};
