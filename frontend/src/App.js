import './App.css';
import Navbar from './Components/Navbar';
import Home from './pages/Home';
import Expenses from './pages/Expenses';
import Income from './pages/Income';
import History from './pages/History';
import Charts from './pages/Charts';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/income" element={<Income />} />
            <Route path="/history" element={<History />} />
            <Route path="/charts" element={<Charts />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
