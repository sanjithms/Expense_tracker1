import React, { useEffect, useState, useRef } from 'react';
import { Line, Pie } from 'react-chartjs-2';
// eslint-disable-next-line no-unused-vars
import Chart from 'chart.js/auto';
import html2canvas from 'html2canvas';
import '../styles/chart.css';

import { getIncome, getExpenses } from '../utils/api';

const Charts = () => {
  const [chartType, setChartType] = useState('line');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState('');
  const [income, setIncome] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const chartRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [incomeRes, expensesRes] = await Promise.all([getIncome(), getExpenses()]);
      setIncome(incomeRes.data);
      setExpenses(expensesRes.data);
    } catch (err) {
      console.error('Error fetching chart data:', err);
    }
  };

  const getMonthlyTotals = (data) => {
    const totals = new Array(12).fill(0);
    data.forEach((item) => {
      if (item.year === selectedYear) {
        totals[item.month - 1] += item.amount;
      }
    });
    return totals;
  };

  const getFilteredTotal = (data) => {
    return data
      .filter(
        (item) =>
          (!selectedMonth || item.month === parseInt(selectedMonth)) &&
          item.year === selectedYear
      )
      .reduce((acc, item) => acc + item.amount, 0);
  };

  const incomeData = getMonthlyTotals(income);
  const expenseData = getMonthlyTotals(expenses);
  const totalIncome = getFilteredTotal(income);
  const totalExpenses = getFilteredTotal(expenses);
  const balance = totalIncome - totalExpenses;

  const chartData = {
    labels: Array.from({ length: 12 }, (_, i) =>
      new Date(0, i).toLocaleString('default', { month: 'short' })
    ),
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#28a745',
        backgroundColor: 'rgba(40, 167, 69, 0.3)',
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#28a745'
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#dc3545',
        backgroundColor: 'rgba(220, 53, 69, 0.3)',
        fill: chartType === 'line',
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: '#dc3545'
      }
    ]
  };

  const pieChartData = {
    labels: ['Income', 'Expenses'],
    datasets: [
      {
        data: [totalIncome, totalExpenses],
        backgroundColor: ['#28a745', '#dc3545']
      }
    ]
  };

  const handleExportImage = () => {
    html2canvas(chartRef.current).then((canvas) => {
      const link = document.createElement('a');
      link.download = 'chart.png';
      link.href = canvas.toDataURL();
      link.click();
    });
  };

  const allYears = Array.from(new Set([...income, ...expenses].map((i) => i.year))).sort();

  return (
    <div className="chart-container">
      <h2>Charts</h2>

      <div className="chart-controls">
        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
          {allYears.map((year) => (
            <option key={year} value={year}>{year}</option>
          ))}
        </select>

        <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('default', { month: 'long' })}
            </option>
          ))}
        </select>

        <div>
          <button
            onClick={() => setChartType('line')}
            className={chartType === 'line' ? 'active' : ''}
          >
            Line
          </button>
          <button
            onClick={() => setChartType('pie')}
            className={chartType === 'pie' ? 'active' : ''}
          >
            Pie
          </button>
        </div>

      </div>

      

      <div ref={chartRef} className={`chart-wrapper ${chartType === 'pie' ? 'pie-chart' : ''}`}>
        {chartType === 'line' ? <Line data={chartData} /> : <Pie data={pieChartData} />}
      </div>
      <div className="summary-boxes">
        <div className="summary-box income-box">Income: ₹{totalIncome.toFixed(2)}</div>
        <div className="summary-box expense-box">Expenses: ₹{totalExpenses.toFixed(2)}</div>
        <div className="summary-box balance-box">Balance: ₹{balance.toFixed(2)}</div>
      </div>
      
        <button onClick={handleExportImage} className="export-btn">Export Chart</button>
    </div>
  );
};

export default Charts;
