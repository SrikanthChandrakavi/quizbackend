import React from 'react';
import { Route, Routes } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import CreateQuiz from './CreateQuiz';
import ManageQuizzes from './ManageQuizzes';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <AdminNavbar />
      <div className="admin-content">
        <Routes>
          <Route path="/" element={<h2>Welcome to the Admin Dashboard</h2>} />
          <Route path="/create-quiz" element={<CreateQuiz />} />
          <Route path="/manage-quizzes" element={<ManageQuizzes />} />
        </Routes>
      </div>
    </div>
  );
};

export default AdminDashboard;