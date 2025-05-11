import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/PlayQuiz.css';

const PlayQuiz = () => {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState('');
  const [userAnswers, setUserAnswers] = useState({});
  const [timer, setTimer] = useState(10);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

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
      setCurrentQuestionIndex(0);
      setScore(0);
      setQuizCompleted(false);
      setSelectedOption('');
      setUserAnswers({});
      setTimer(10);
      setIsTimerRunning(true);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setQuestions([]);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    let interval;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
      handleNextQuestion(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  const handleGenreSelect = (genre) => {
    setSelectedGenre(genre);
    fetchQuestionsByGenre(genre);
  };

  const handleSubmitAnswer = async () => {
    setIsTimerRunning(false);
    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = selectedOption === currentQuestion.correctAnswer;

    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption || 'Not Attempted'
    }));

    if (isCorrect) {
      setScore(prev => prev + 10);
    }

    const userScore = {
      userId: user.id,
      questionId: currentQuestion.id,
      score: isCorrect ? 10 : 0
    };
    try {
      const response = await axios.post('http://localhost:8080/api/scores', userScore);
      console.log('Score saved:', response.data);
    } catch (error) {
      console.error('Error saving score:', error);
    }

    handleNextQuestion(isCorrect);
  };

  const handleNextQuestion = (isCorrect) => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < questions.length) {
      if (!selectedOption) {
        setUserAnswers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].id]: 'Not Attempted'
        }));
      }
      setCurrentQuestionIndex(nextIndex);
      setSelectedOption('');
      setTimer(60);
      setIsTimerRunning(true);
    } else {
      if (!selectedOption) {
        setUserAnswers(prev => ({
          ...prev,
          [questions[currentQuestionIndex].id]: 'Not Attempted'
        }));
      }
      setQuizCompleted(true);
      setIsTimerRunning(false);
    }
  };

  const handleRestart = () => {
    setSelectedGenre('');
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption('');
    setUserAnswers({});
    setTimer(10);
    setIsTimerRunning(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const handleReview = () => {
    console.log('Navigating to review with:', { genre: selectedGenre, userAnswers, questions });
    navigate('/review', { state: { genre: selectedGenre, userAnswers, questions } });
  };

  const getAvailableOptions = (question) => {
    const options = [
      { label: 'A', value: question.option1 },
      { label: 'B', value: question.option2 },
      { label: 'C', value: question.option3 },
      { label: 'D', value: question.option4 }
    ];
    return options.filter(option => option.value);
  };

  return (
    <div className="play-quiz-container">
      <h2>Play Quiz</h2>
      {!selectedGenre ? (
        <div className="genre-selection">
          <h3>Select a Genre to Play</h3>
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
      ) : quizCompleted ? (
        <div className="quiz-results">
          <h3>Quiz Completed!</h3>
          <p>Your Score: {score} / {questions.length * 10}</p>
          <button onClick={handleRestart} className="restart-btn">Play Again</button>
          <button onClick={handleReview} className="review-btn">Review Answers</button>
        </div>
      ) : questions.length === 0 ? (
        <p>No questions available in this genre.</p>
      ) : (
        <div className="quiz-play">
          <h3>Question {currentQuestionIndex + 1} of {questions.length}</h3>
          <p>Genre: {selectedGenre}</p>
          <p>{questions[currentQuestionIndex].questionText}</p>
          <p>Time Remaining: {timer} seconds</p>
          <div className="options">
            {getAvailableOptions(questions[currentQuestionIndex]).map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedOption(option.value)}
                disabled={!isTimerRunning}
              >
                {option.label}: {option.value}
              </button>
            ))}
          </div>
          {selectedOption && isTimerRunning && (
            <button onClick={handleSubmitAnswer} className="submit-btn">Submit Answer</button>
          )}
        </div>
      )}
    </div>
  );
};

export default PlayQuiz;