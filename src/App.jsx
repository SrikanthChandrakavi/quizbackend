import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import About from './components/About';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import UserLeaderboard from './components/UserLeaderboard'; // Import the UserLeaderboard component
import Review from './components/Review';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/admin-dashboard/*" element={<AdminDashboard />} />
          <Route path="/user-dashboard/*" element={<UserDashboard />} />
          <Route path="*" element={
            <>
              <Navbar />
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/about" element={<About />} />
                <Route path="/review" element={<Review />} />
                <Route path="/leaderboard" element={<UserLeaderboard />} /> {/* Add Leaderboard route */}
              </Routes>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;