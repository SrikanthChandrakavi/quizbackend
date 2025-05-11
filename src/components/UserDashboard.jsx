import React from 'react';
import { Route, Routes } from 'react-router-dom';
import UserNavbar from './UserNavbar';
import PlayQuiz from './PlayQuiz';
import Leaderboard from './Leaderboard';
import '../styles/UserDashboard.css';

const UserDashboard = () => {
  return (
    <div className="user-dashboard">
      <UserNavbar />
      <div className="user-content">
        <Routes>
          <Route path="/" element={<h2>Welcome to the User Dashboard</h2>} />
          <Route path="/play-quiz" element={<PlayQuiz />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;