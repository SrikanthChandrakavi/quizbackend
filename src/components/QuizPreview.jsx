import React from 'react';
import '../styles/QuizPreview.css';

const QuizPreview = () => {
  return (
    <div className="quiz-preview">
      <div className="quiz-card">
        <h3>What is the capital of Sweden?</h3>
        <p className="timer">00:14</p>
        <div className="progress-bar">
          <div className="progress" style={{ width: '50%' }}></div>
        </div>
        <div className="options">
          <button>Stockholm</button>
          <button>Copenhagen</button>
          <button>Helsinki</button>
          <button>Oslo</button>
        </div>
      </div>
    </div>
  );
};

export default QuizPreview;