import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/Review.css';

const Review = () => {
  const [scores, setScores] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const { genre, userAnswers = {}, questions = [] } = location.state || {};

  useEffect(() => {
    console.log('Review page received:', { genre, userAnswers, questions, user });
    if (!genre || !questions.length || !user) {
      console.error('Missing required data for review:', { genre, userAnswers, questions, user });
      return;
    }

    const fetchScores = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/scores/user/${user.id}/genre/${genre}`);
        console.log('Fetched scores:', response.data);
        setScores(response.data);
      } catch (error) {
        console.error('Error fetching scores:', error);
        setScores([]);
      }
    };

    fetchScores();
  }, [genre, user, navigate]);

  const getUserAnswer = (questionId) => {
    return userAnswers[questionId] || 'Not Attempted';
  };

  const getCorrectAnswer = (question) => {
    return question.correctAnswer;
  };

  const getResult = (question) => {
    const userAnswer = getUserAnswer(question.id);
    if (userAnswer === 'Not Attempted') {
      return 'Not Attempted';
    }

    const scoreEntry = scores.find(score => score.questionId === question.id);
    if (!scoreEntry) {
      const isCorrect = userAnswer === question.correctAnswer;
      return isCorrect ? 'Correct' : 'Incorrect';
    }

    return scoreEntry.score > 0 ? 'Correct' : 'Incorrect';
  };

  const getOptionLabel = (option, question) => {
    if (option === question.option1) return 'A';
    if (option === question.option2) return 'B';
    if (option === question.option3) return 'C';
    if (option === question.option4) return 'D';
    return '';
  };

  const handleBack = () => {
    navigate('/user-dashboard');
  };

  if (!genre || !questions.length || !user) {
    return (
      <div className="review-container">
        <h2>Error</h2>
        <p>Unable to load review data. Please try playing a quiz again.</p>
        <button onClick={handleBack} className="back-btn">Back to Dashboard</button>
      </div>
    );
  }

  return (
    <div className="review-container">
      <h2>Review - {genre}</h2>
      <div className="review-header">
        <p>Total Questions: {questions.length}</p>
      </div>
      {questions.length === 0 ? (
        <p>No questions available in this genre.</p>
      ) : (
        <div className="review-list">
          {questions.map((question, index) => {
            const userAnswer = getUserAnswer(question.id);
            const correctAnswer = getCorrectAnswer(question);
            const result = getResult(question);
            return (
              <div key={question.id} className="review-card">
                <div className="question-header">
                  <h3>Question {index + 1}</h3>
                </div>
                <p className="question-text">{question.questionText}</p>
                <div className="options">
                  <p><strong>A:</strong> {question.option1}</p>
                  <p><strong>B:</strong> {question.option2}</p>
                  <p><strong>C:</strong> {question.option3}</p>
                  <p><strong>D:</strong> {question.option4}</p>
                </div>
                <div className="answer-section">
                  <p>
                    <strong>Your Answer:</strong>{' '}
                    {userAnswer === 'Not Attempted' ? 'Not Attempted' : `${getOptionLabel(userAnswer, question)}. ${userAnswer}`}
                  </p>
                  <p>
                    <strong>Correct Answer:</strong> {getOptionLabel(correctAnswer, question)}. {correctAnswer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
      <button onClick={handleBack} className="back-btn">Back to Dashboard</button>
    </div>
  );
};

export default Review;