import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Leaderboard.css';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const scoresResponse = await axios.get('http://localhost:8080/api/scores/leaderboard');
        const usersResponse = await axios.get('http://localhost:8080/api/users');
        setLeaderboard(scoresResponse.data);
        setUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };
    fetchLeaderboard();
  }, []);

  // Aggregate scores by user
  const aggregatedScores = leaderboard.reduce((acc, score) => {
    if (!acc[score.userId]) {
      acc[score.userId] = { userId: score.userId, totalScore: 0 };
    }
    acc[score.userId].totalScore += score.score;
    return acc;
  }, {});

  // Convert to array and sort by total score
  const sortedLeaderboard = Object.values(aggregatedScores).sort((a, b) => b.totalScore - a.totalScore);

  return (
    <div className="leaderboard-container">
      <h2>User Leaderboard</h2>
      {sortedLeaderboard.length === 0 ? (
        <p>No users have completed quizzes yet.</p>
      ) : (
        <table className="leaderboard-table">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Username</th>
              <th>Total Points</th>
            </tr>
          </thead>
          <tbody>
            {sortedLeaderboard.map((entry, index) => {
              const user = users.find(u => u.id === entry.userId);
              return (
                <tr key={entry.userId}>
                  <td>{index + 1}</td>
                  <td>{user ? user.username : 'Unknown'}</td>
                  <td>{entry.totalScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Leaderboard;