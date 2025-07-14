import { Link } from "react-router-dom";
import { useState } from "react";
import './Navbar.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <h1>💸 Expense Tracker</h1>

      <div
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      <div className={`nav-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/" onClick={handleLinkClick}>Home</Link>
        <Link to="/expenses" onClick={handleLinkClick}>Expenses</Link>
        <Link to="/income" onClick={handleLinkClick}>Income</Link>
        <Link to="/history" onClick={handleLinkClick}>Transaction History</Link>
        <Link to="/charts" onClick={handleLinkClick}>Chart</Link>
      </div>
    </nav>
  );
}

export default Navbar;
