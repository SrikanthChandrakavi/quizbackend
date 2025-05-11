import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/UserNavbar.css';

const UserNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <div className="user-logo">User Dashboard</div>
      <ul className="user-nav-links">
        <li><Link to="/user-dashboard/play-quiz">Play Quiz</Link></li>
        <li><Link to="/user-dashboard/leaderboard">User Leaderboard</Link></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default UserNavbar;