// script.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/expense_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Schemas
const incomeSchema = new mongoose.Schema({
  source: String,
  amount: Number,
  date: String,
  month: Number,
  year: Number
});

const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  date: String,
  month: Number,
  year: Number
});

const Income = mongoose.model('Income', incomeSchema);
const Expense = mongoose.model('Expense', expenseSchema);

// Routes - Income
app.get('/api/income', async (req, res) => {
  const data = await Income.find();
  res.json(data);
});

app.post('/api/income', async (req, res) => {
  const income = new Income(req.body);
  await income.save();
  res.json(income);
});

app.delete('/api/income/:id', async (req, res) => {
  await Income.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

// Routes - Expense
app.get('/api/expenses', async (req, res) => {
  const data = await Expense.find();
  res.json(data);
});

app.post('/api/expenses', async (req, res) => {
  const expense = new Expense(req.body);
  await expense.save();
  res.json(expense);
});

app.delete('/api/expenses/:id', async (req, res) => {
  await Expense.findByIdAndDelete(req.params.id);
  res.sendStatus(204);
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
