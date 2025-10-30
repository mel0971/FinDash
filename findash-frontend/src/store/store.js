import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import portfolioReducer from './portfolioSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    portfolio: portfolioReducer,
  },
});

export default store;
