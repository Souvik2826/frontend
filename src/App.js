import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import InterviewSimulator from './components/InterviewSimulator';
import Header from './components/Header';
import { ApiKeyProvider } from './context/ApiKeyContext';
import './App.css';

function App() {
  return (
    <ApiKeyProvider>
      <Router>
        <div className="App">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/interview" element={<InterviewSimulator />} />
              <Route path="/api-key" element={<Navigate to="/interview" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </ApiKeyProvider>
  );
}

export default App;
