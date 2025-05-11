import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">QuizMaker</div>
      <ul className="nav-links">
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
        <li><Link to="/about">About</Link></li>
        <Link to="/leaderboard">Leaderboard</Link>
      </ul>
      <div className="auth-buttons">
        {/* Removed the Sign up button */}
      </div>
    </nav>
  );
};

export default Navbar;