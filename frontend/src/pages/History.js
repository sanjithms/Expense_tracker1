import React, { useEffect, useState } from 'react';
import '../styles/history.css';
import {
  getIncome,
  getExpenses,
  deleteIncome,
  deleteExpense
} from '../utils/api'; // assuming centralized API file exists

const History = () => {
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [filterMonth, setFilterMonth] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomeRes, expensesRes] = await Promise.all([getIncome(), getExpenses()]);
      setIncome(incomeRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const filteredIncome = income.filter((item) => {
    const matchMonth = filterMonth ? item.month === parseInt(filterMonth) : true;
    const matchYear = filterYear ? item.year === parseInt(filterYear) : true;
    return matchMonth && matchYear;
  });

  const filteredExpenses = expenses.filter((item) => {
    const matchMonth = filterMonth ? item.month === parseInt(filterMonth) : true;
    const matchYear = filterYear ? item.year === parseInt(filterYear) : true;
    return matchMonth && matchYear;
  });

  const totalIncome = filteredIncome.reduce((acc, item) => acc + item.amount, 0);
  const totalExpenses = filteredExpenses.reduce((acc, item) => acc + item.amount, 0);
  const balance = totalIncome - totalExpenses;

  const allYears = Array.from(new Set([...income, ...expenses].map((e) => e.year)));

  const handleDeleteIncome = async (id) => {
    try {
      await deleteIncome(id);
      setIncome(income.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete income:', err);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await deleteExpense(id);
      setExpenses(expenses.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete expense:', err);
    }
  };

  const handleExportFiltered = () => {
    const rows = [['Type', 'Title/Source', 'Amount', 'Date']];

    filteredIncome.forEach((i) => {
      rows.push(['Income', i.source, i.amount, i.date]);
    });

    filteredExpenses.forEach((e) => {
      rows.push(['Expense', e.title, e.amount, e.date]);
    });

    const csvContent = rows.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'filtered-transaction-history.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="history-container">
      <h2>Transaction History</h2>

      <div className="filters">
        <select onChange={(e) => setFilterMonth(e.target.value)} value={filterMonth}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option value={i + 1} key={i}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <select onChange={(e) => setFilterYear(e.target.value)} value={filterYear}>
          <option value="">All Years</option>
          {allYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="summary">
        <div className="summary-box income-box">
          <h4>Total Income</h4>
          ₹{totalIncome.toFixed(2)}
        </div>
        <div className="summary-box expense-box">
          <h4>Total Expenses</h4>
          ₹{totalExpenses.toFixed(2)}
        </div>
        <div className="summary-box balance-box">
          <h4>Balance</h4>
          ₹{balance.toFixed(2)}
        </div>
      </div>

      <div className="history-section">
        <h3>Income</h3>
        {filteredIncome.length === 0 && <p>No income records found.</p>}
        <ul>
          {filteredIncome.map((item) => (
            <li key={item._id}>
              <div>
                <strong>{item.source}</strong> + ₹{item.amount}
                <button className="delete-btn" onClick={() => handleDeleteIncome(item._id)}>Delete</button>
              </div>
              <small>{item.date}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="history-section">
        <h3>Expenses</h3>
        {filteredExpenses.length === 0 && <p>No expenses records found.</p>}
        <ul>
          {filteredExpenses.map((item) => (
            <li key={item._id}>
              <div>
                <strong>{item.title}</strong> - ₹{item.amount}
                <button className="delete-btn" onClick={() => handleDeleteExpense(item._id)}>Delete</button>
              </div>
              <small>{item.date}</small>
            </li>
          ))}
        </ul>
      </div>

      <div className="export-buttons">
        <button onClick={handleExportFiltered}>Export Filtered Data</button>
      </div>
    </div>
  );
};

export default History;
