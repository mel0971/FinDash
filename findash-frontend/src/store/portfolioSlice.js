import { createSlice } from '@reduxjs/toolkit';

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState: {
    portfolios: [],
    currentPortfolio: null,
    holdings: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    fetchPortfoliosStart: (state) => {
      state.isLoading = true;
    },
    fetchPortfoliosSuccess: (state, action) => {
      state.isLoading = false;
      state.portfolios = action.payload;
    },
    fetchPortfoliosError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    setCurrentPortfolio: (state, action) => {
      state.currentPortfolio = action.payload;
    },
    setHoldings: (state, action) => {
      state.holdings = action.payload;
    },
  },
});

export const { 
  fetchPortfoliosStart, 
  fetchPortfoliosSuccess, 
  fetchPortfoliosError,
  setCurrentPortfolio,
  setHoldings,
} = portfolioSlice.actions;
export default portfolioSlice.reducer;
