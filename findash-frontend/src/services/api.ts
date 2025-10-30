import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// AuthService
export const authService = {
  login: (credentials) => axiosInstance.post("/auth/login", credentials),
  register: (data) => axiosInstance.post("/auth/register", data),
  logout: () => localStorage.removeItem("token"),
};

// PortfolioService
export const portfolioService = {
  getPortfolios: () => {
    const token = localStorage.getItem("token");
    return axiosInstance.get("/portfolio", {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  createPortfolio: (data) => {
    const token = localStorage.getItem("token");
    return axiosInstance.post("/portfolio", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  deletePortfolio: (portfolioId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.delete(`/portfolio/${portfolioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  updatePortfolio: (portfolioId, data) => {
    const token = localStorage.getItem("token");
    return axiosInstance.put(`/portfolio/${portfolioId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// HoldingsService
export const holdingsService = {
  getHoldings: (portfolioId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.get(`/holdings/${portfolioId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  addHolding: (portfolioId, data) => {
    const token = localStorage.getItem("token");
    return axiosInstance.post(`/holdings/${portfolioId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  updateHolding: (holdingId, data) => {
    const token = localStorage.getItem("token");
    return axiosInstance.put(`/holdings/${holdingId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  deleteHolding: (holdingId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.delete(`/holdings/${holdingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};

// ✅ AlertService
export const alertService = {
  getAlerts: (holdingId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.get(`/alerts/holding/${holdingId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  createAlert: (holdingId, data) => {
    const token = localStorage.getItem("token");
    return axiosInstance.post(`/alerts/holding/${holdingId}`, data, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  deleteAlert: (alertId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.delete(`/alerts/${alertId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
  toggleAlert: (alertId) => {
    const token = localStorage.getItem("token");
    return axiosInstance.patch(`/alerts/${alertId}/toggle`, {}, {
      headers: { Authorization: `Bearer ${token}` },
    });
  },
};
