import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-title">Welcome to Interview Simulator</h1>
      <p className="home-subtitle">Practice interview questions powered by AI</p>
      
      <Link to="/interview" className="btn btn-large">
        Start Practicing
      </Link>
      
      <div className="features">
        <div className="feature-card card">
          <h3>AI-Generated Questions</h3>
          <p>Get realistic interview questions for different topics using Google's Gemini AI.</p>
        </div>
        
        <div className="feature-card card">
          <h3>Detailed Feedback</h3>
          <p>Receive thorough feedback on your answers with technical accuracy evaluation.</p>
        </div>
        
        <div className="feature-card card">
          <h3>Multiple Topics</h3>
          <p>Practice with questions on JavaScript, React, CSS, HTML and more.</p>
        </div>
      </div>
    </div>
  );
};

export default Home; 