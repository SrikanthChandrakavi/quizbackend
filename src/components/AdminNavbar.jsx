import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user'); // Clear user from local storage
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-logo">Admin Dashboard</div>
      <ul className="admin-nav-links">
        <li><Link to="/admin-dashboard/create-quiz">Create Quiz</Link></li>
        <li><Link to="/admin-dashboard/manage-quizzes">Manage Quizzes</Link></li>
        <li><button onClick={handleLogout} className="logout-btn">Logout</button></li>
      </ul>
    </nav>
  );
};

export default AdminNavbar;