import '../styles/Home.css';
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>
          Welcome to <span>Expense Tracker</span>
        </h1>
        <p>
          Monitor your income and expenses, visualize spending patterns, and gain
          control of your financial goals with ease.
        </p>
        <Link to="/expenses" className="home-btn">Get Started</Link>
      </div>
      <div className="home-image">
        <img
          src="https://img.freepik.com/free-vector/budget-planning-concept-illustration_114360-7654.jpg"
          alt="Budget Planning"
        />
      </div>
    </div>
  );
};

export default Home;
