import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useApiKey } from '../context/ApiKeyContext';

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json';

const API_URL = 'http://localhost:5000/api';

const InterviewSimulator = () => {
  const { apiKey } = useApiKey();
  const navigate = useNavigate();
  const [topic, setTopic] = useState('all');
  const [difficulty, setDifficulty] = useState('all');
  const [question, setQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    // Always fetch a question when the component mounts
    fetchQuestion();
  }, []);

  const fetchQuestion = async () => {
    setLoading(true);
    setIsGenerating(true);
    setFeedback(null);
    setAnswer('');
    setError('');

    try {
      console.log("Fetching question...");
      const response = await axios({
        method: 'get',
        url: `${API_URL}/questions`,
        params: { topic, difficulty },
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      console.log("Question response:", response.data);
      setQuestion(response.data);
    } catch (err) {
      console.error('Error fetching question:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to fetch question. Please try again.');
      }
    } finally {
      setLoading(false);
      setIsGenerating(false);
    }
  };

  const submitAnswer = async () => {
    if (answer.trim() === '') {
      setError('Please provide an answer before submitting');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log("Submitting answer...");
      
      const response = await axios({
        method: 'post',
        url: `${API_URL}/feedback`,
        headers: {
          'X-API-KEY': apiKey,
          'Content-Type': 'application/json'
        },
        data: {
          answer,
          topic: question.topic || topic,
          question: question ? question.question : ''
        },
        timeout: 30000 // 30 seconds timeout for longer AI processing
      });
      
      console.log("Feedback response:", response.data);
      
      if (response.data.source === "predefined") {
        console.warn("Warning: Using predefined feedback instead of AI. API key may not be working.");
      } else if (response.data.source === "error") {
        setError(`API Error: ${response.data.error || "Unknown error with the AI service"}`);
      }
      
      setFeedback(response.data);
    } catch (err) {
      console.error('Error getting feedback:', err);
      if (err.response && err.response.data) {
        if (err.response.data.error) {
          setError(err.response.data.error);
        }
      } else if (err.code === 'ECONNABORTED') {
        setError('Request timed out. The AI service might be busy. Please try again.');
      } else {
        setError('Failed to get feedback. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleTopicChange = (e) => {
    setTopic(e.target.value);
  };

  const handleDifficultyChange = (e) => {
    setDifficulty(e.target.value);
  };

  return (
    <div>
      <h1>Interview Simulator</h1>
      
      <div className="form-controls card">
        <div className="form-group">
          <label htmlFor="topic">Topic:</label>
          <select
            id="topic"
            className="form-select"
            value={topic}
            onChange={handleTopicChange}
            disabled={loading}
          >
            <option value="all">All Topics</option>
            <option value="javascript">JavaScript</option>
            <option value="react">React</option>
            <option value="css">CSS</option>
            <option value="html">HTML</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="difficulty">Difficulty:</label>
          <select
            id="difficulty"
            className="form-select"
            value={difficulty}
            onChange={handleDifficultyChange}
            disabled={loading}
          >
            <option value="all">All Levels</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>

        <button className="btn" onClick={fetchQuestion} disabled={loading}>
          {isGenerating ? 'Generating Question...' : loading ? 'Loading...' : 'Get New Question'}
        </button>
      </div>

      {error && <div className="card" style={{ borderLeft: '4px solid var(--danger-color)' }}>{error}</div>}

      {question && (
        <div className="interview-container">
          <div className="question-section">
            <div className="card question-card">
              <div className="question-header">
                <h2>Interview Question</h2>
              </div>
              <div className="question-meta">
                <span className={`topic-tag ${question.topic || topic}`}>
                  {question.topic || topic}
                </span>
                <span className={`difficulty-tag ${question.difficulty || difficulty}`}>
                  {question.difficulty || difficulty}
                </span>
              </div>
              <p className="question-text">{question.question}</p>
            </div>
          </div>

          <div className="answer-section">
            <div className="card">
              <h2>Your Answer</h2>
              <textarea
                className="answer-input"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                disabled={loading}
              ></textarea>
              <div className="controls">
                <button className="btn" onClick={submitAnswer} disabled={loading}>
                  {loading ? 'Getting Feedback...' : 'Submit Answer'}
                </button>
              </div>
            </div>

            {feedback && (
              <div className="feedback-section">
                <div className="card feedback-card">
                  <div className="feedback-header">
                    <h2>AI Feedback</h2>
                  </div>
                  <div className="feedback-content">
                    {feedback.correctness && (
                      <div className={`correctness-indicator ${feedback.correctness.toLowerCase()}`}>
                        <strong>Answer Correctness: {feedback.correctness}</strong>
                      </div>
                    )}
                    <p>{feedback.feedback}</p>
                    {feedback.missing_points && feedback.missing_points !== "N/A" && (
                      <div className="missing-points">
                        <strong>Missing Points:</strong>
                        <p>{feedback.missing_points}</p>
                      </div>
                    )}
                    {feedback.correct_answer && feedback.correct_answer !== "Cannot generate a correct answer without AI evaluation" && (
                      <div className="correct-answer">
                        <strong>Correct Answer:</strong>
                        <p>{feedback.correct_answer}</p>
                      </div>
                    )}
                  </div>
                  <div className="feedback-stats">
                    <div className="stat-item">
                      Confidence: {Math.round(feedback.confidence * 100)}%
                    </div>
                    <div className="stat-item">
                      Keywords Used: {feedback.keywords_used}
                    </div>
                    <div className="stat-item">
                      Word Count: {feedback.word_count}
                    </div>
                    {feedback.source && (
                      <div className="stat-item">
                        Source: {feedback.source === "ai" ? "AI Analysis" : "Basic Analysis"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewSimulator; 