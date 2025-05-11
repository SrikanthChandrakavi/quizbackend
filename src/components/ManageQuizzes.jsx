import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ManageQuizzes.css';

const ManageQuizzes = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');
  const [editingOption, setEditingOption] = useState(null);
  const [newOptionText, setNewOptionText] = useState('');

  const fetchGenres = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/questions/genres');
      setGenres(response.data);
    } catch (error) {
      console.error('Error fetching genres:', error);
      setGenres([]);
    }
  };

  const fetchQuestionsByGenre = async (genre) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/questions/genre/${genre}`);
      setQuestions(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    fetchQuestionsByGenre(genre);
    setEditingOption(null);
  };

  const handleDeleteQuestion = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/questions/${id}`);
      setQuestions(questions.filter(q => q.id !== id));
      setError('');
      setEditingOption(null);
    } catch (error) {
      console.error('Error deleting question:', error);
      setError('Failed to delete the question. Please try again.');
    }
  };

  const handleDeleteOption = async (questionId, optionKey) => {
    try {
      const question = questions.find(q => q.id === questionId);
      if (question.correctAnswer === question[optionKey]) {
        alert('Cannot delete the correct answer option. Please update the correct answer first.');
        return;
      }

      const nonEmptyOptions = [question.option1, question.option2, question.option3, question.option4]
        .filter(option => option && option !== '').length;

      if (nonEmptyOptions <= 2) {
        alert('Cannot delete this option. A question must have at least 2 non-empty options.');
        return;
      }

      const updatedQuestion = { ...question, [optionKey]: '' };
      const response = await axios.put(`http://localhost:8080/api/questions/${questionId}`, updatedQuestion);
      setQuestions(questions.map(q => (q.id === questionId ? response.data : q)));
      setError('');
      setEditingOption(null);
    } catch (error) {
      console.error('Error deleting option:', error);
      setError(error.response?.data?.message || 'Failed to delete the option. Please try again.');
    }
  };

  const handleUpdateOptionStart = (questionId, optionKey, currentText) => {
    setEditingOption({ questionId, optionKey });
    setNewOptionText(currentText);
  };

  const handleUpdateOptionSave = async (questionId, optionKey) => {
    if (!newOptionText.trim()) {
      alert('Option text cannot be empty.');
      return;
    }

    try {
      const question = questions.find(q => q.id === questionId);
      const updatedQuestion = { ...question, [optionKey]: newOptionText.trim() };
      if (question.correctAnswer === question[optionKey]) {
        updatedQuestion.correctAnswer = newOptionText.trim();
      }

      const response = await axios.put(`http://localhost:8080/api/questions/${questionId}`, updatedQuestion);
      setQuestions(questions.map(q => (q.id === questionId ? response.data : q)));
      setError('');
      setEditingOption(null);
      setNewOptionText('');
    } catch (error) {
      console.error('Error updating option:', error);
      setError(error.response?.data?.message || 'Failed to update the option. Please try again.');
    }
  };

  const handleUpdateOptionCancel = () => {
    setEditingOption(null);
    setNewOptionText('');
  };

  return (
    <div className="manage-quizzes-container">
      <h2>Manage Quizzes</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="genre-selection">
        <h3>Select Genre to Manage</h3>
        {genres.length === 0 ? (
          <p>No genres available.</p>
        ) : (
          <select value={selectedGenre} onChange={(e) => handleGenreSelect(e.target.value)}>
            <option value="">Select a genre</option>
            {genres.map((genre, index) => (
              <option key={index} value={genre}>{genre}</option>
            ))}
          </select>
        )}
      </div>

      {selectedGenre && (
        <div className="questions-list">
          <h3>Questions in {selectedGenre}</h3>
          {questions.length === 0 ? (
            <p>No questions available in this genre.</p>
          ) : (
            <ul>
              {questions.map((question) => (
                <li key={question.id} className="question-item">
                  <div className="question-content">
                    <p><strong>Question:</strong> {question.questionText}</p>
                    <div className="options">
                      <p>
                        <strong>A:</strong>{' '}
                        {editingOption?.questionId === question.id && editingOption?.optionKey === 'option1' ? (
                          <>
                            <input
                              type="text"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              className="option-input"
                            />
                            <button
                              onClick={() => handleUpdateOptionSave(question.id, 'option1')}
                              className="save-option-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleUpdateOptionCancel}
                              className="cancel-option-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {question.option1 || 'N/A'}
                            {question.option1 && (
                              <>
                                <button
                                  onClick={() => handleUpdateOptionStart(question.id, 'option1', question.option1)}
                                  className="update-option-btn"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleDeleteOption(question.id, 'option1')}
                                  className="delete-option-btn"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p>
                        <strong>B:</strong>{' '}
                        {editingOption?.questionId === question.id && editingOption?.optionKey === 'option2' ? (
                          <>
                            <input
                              type="text"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              className="option-input"
                            />
                            <button
                              onClick={() => handleUpdateOptionSave(question.id, 'option2')}
                              className="save-option-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleUpdateOptionCancel}
                              className="cancel-option-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {question.option2 || 'N/A'}
                            {question.option2 && (
                              <>
                                <button
                                  onClick={() => handleUpdateOptionStart(question.id, 'option2', question.option2)}
                                  className="update-option-btn"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleDeleteOption(question.id, 'option2')}
                                  className="delete-option-btn"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p>
                        <strong>C:</strong>{' '}
                        {editingOption?.questionId === question.id && editingOption?.optionKey === 'option3' ? (
                          <>
                            <input
                              type="text"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              className="option-input"
                            />
                            <button
                              onClick={() => handleUpdateOptionSave(question.id, 'option3')}
                              className="save-option-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleUpdateOptionCancel}
                              className="cancel-option-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {question.option3 || 'N/A'}
                            {question.option3 && (
                              <>
                                <button
                                  onClick={() => handleUpdateOptionStart(question.id, 'option3', question.option3)}
                                  className="update-option-btn"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleDeleteOption(question.id, 'option3')}
                                  className="delete-option-btn"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p>
                        <strong>D:</strong>{' '}
                        {editingOption?.questionId === question.id && editingOption?.optionKey === 'option4' ? (
                          <>
                            <input
                              type="text"
                              value={newOptionText}
                              onChange={(e) => setNewOptionText(e.target.value)}
                              className="option-input"
                            />
                            <button
                              onClick={() => handleUpdateOptionSave(question.id, 'option4')}
                              className="save-option-btn"
                            >
                              Save
                            </button>
                            <button
                              onClick={handleUpdateOptionCancel}
                              className="cancel-option-btn"
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            {question.option4 || 'N/A'}
                            {question.option4 && (
                              <>
                                <button
                                  onClick={() => handleUpdateOptionStart(question.id, 'option4', question.option4)}
                                  className="update-option-btn"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => handleDeleteOption(question.id, 'option4')}
                                  className="delete-option-btn"
                                >
                                  Delete
                                </button>
                              </>
                            )}
                          </>
                        )}
                      </p>
                      <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteQuestion(question.id)} className="delete-btn">Delete Question</button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageQuizzes;