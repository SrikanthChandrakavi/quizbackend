import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/UserLeaderboard.css';

const UserLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState('');

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users/leaderboard');
      // Sort the data by score in descending order
      const sortedLeaderboard = response.data.sort((a, b) => b.score - a.score);
      setLeaderboard(sortedLeaderboard);
      setError('');
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setError('Failed to load leaderboard. Please try again.');
      setLeaderboard([]);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      {error && <p className="error-message">{error}</p>}
      {leaderboard.length === 0 ? (
        <p>No users found in the leaderboard.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            {leaderboard.map((user, index) => (
              <tr key={user.username} className={index < 3 ? `top-${index + 1}` : ''}>
                <td>{index + 1}</td>
                <td>{user.username}</td>
                <td>{user.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserLeaderboard;