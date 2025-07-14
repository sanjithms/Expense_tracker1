import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getExpenses = () => axios.get(`${API_URL}/expenses`);
export const addExpense = (data) => axios.post(`${API_URL}/expenses`, data);
export const deleteExpense = (id) => axios.delete(`${API_URL}/expenses/${id}`);

export const getIncome = () => axios.get(`${API_URL}/income`);
export const addIncome = (data) => axios.post(`${API_URL}/income`, data);
export const deleteIncome = (id) => axios.delete(`${API_URL}/income/${id}`);
