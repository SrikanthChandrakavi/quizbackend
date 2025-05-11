import React, { useState } from 'react';
import axios from 'axios';
import '../styles/CreateQuiz.css';

const CreateQuiz = () => {
  const [questionText, setQuestionText] = useState('');
  const [genre, setGenre] = useState(''); // New state for genre
  const [option1, setOption1] = useState('');
  const [option2, setOption2] = useState('');
  const [option3, setOption3] = useState('');
  const [option4, setOption4] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const user = JSON.parse(localStorage.getItem('user'));

  const handleCreateQuiz = async (e) => {
    e.preventDefault();
    if (!genre) {
      alert('Please enter a genre for the quiz.');
      return;
    }

    const question = {
      adminId: user.id,
      genre, // Include genre in the question object
      questionText,
      option1,
      option2,
      option3,
      option4,
      correctAnswer
    };

    try {
      const response = await axios.post('http://localhost:8080/api/questions', question);
      if (response.status === 200) {
        alert('Quiz created successfully!');
        setQuestionText('');
        setGenre('');
        setOption1('');
        setOption2('');
        setOption3('');
        setOption4('');
        setCorrectAnswer('');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      alert('Failed to create quiz.');
    }
  };

  return (
    <div className="create-quiz-container">
      <h2>Create Quiz</h2>
      <form onSubmit={handleCreateQuiz}>
        <div className="form-group">
          <label>Genre:</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Question:</label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Option 1:</label>
          <input
            type="text"
            value={option1}
            onChange={(e) => setOption1(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Option 2:</label>
          <input
            type="text"
            value={option2}
            onChange={(e) => setOption2(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Option 3:</label>
          <input
            type="text"
            value={option3}
            onChange={(e) => setOption3(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Option 4:</label>
          <input
            type="text"
            value={option4}
            onChange={(e) => setOption4(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Correct Answer:</label>
          <select value={correctAnswer} onChange={(e) => setCorrectAnswer(e.target.value)} required>
            <option value="">Select correct answer</option>
            <option value={option1}>{option1}</option>
            <option value={option2}>{option2}</option>
            <option value={option3}>{option3}</option>
            <option value={option4}>{option4}</option>
          </select>
        </div>
        <button type="submit" className="create-btn">Create Quiz</button>
      </form>
    </div>
  );
};

export default CreateQuiz;