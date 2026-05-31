import axios from 'axios';

// Create axios instance
const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to headers
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth services
export const login = async (email, password) => {
  const response = await API.post('/auth/login', { email, password });
  return response.data;
};

export const register = async (name, email, password) => {
  const response = await API.post('/auth/register', { name, email, password });
  return response.data;
};

// Transaction services
export const getTransactions = async (filters = {}) => {
  const response = await API.get('/transactions', { params: filters });
  return response.data;
};

export const createTransaction = async (data) => {
  const response = await API.post('/transactions', data);
  return response.data;
};

export const updateTransaction = async (id, data) => {
  const response = await API.put(`/transactions/${id}`, data);
  return response.data;
};

export const deleteTransaction = async (id) => {
  const response = await API.delete(`/transactions/${id}`);
  return response.data;
};

export const getTransactionSummary = async () => {
  const response = await API.get('/transactions/summary');
  return response.data;
};

// Budget services
export const getBudgets = async () => {
  const response = await API.get('/budgets');
  return response.data;
};

export const upsertBudget = async (month, limit) => {
  const response = await API.post('/budgets', { month, limit });
  return response.data;
};

export const getBudgetStatus = async (month) => {
  const response = await API.get(`/budgets/status/${month}`);
  return response.data;
};

export default API;
