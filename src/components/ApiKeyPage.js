import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApiKey } from '../context/ApiKeyContext';

const DEFAULT_API_KEY = "AIzaSyBFNNQBFTYN4uBi1-V-4b9-K-mo1X7vpHc";

const ApiKeyPage = () => {
  const { apiKey, setApiKey, hasApiKey, clearApiKey } = useApiKey();
  const [inputKey, setInputKey] = useState(apiKey || '');
  const [error, setError] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isUsingDefault, setIsUsingDefault] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    let keyToUse = inputKey.trim();
    
    // If empty and user wants to use default
    if (!keyToUse && isUsingDefault) {
      keyToUse = DEFAULT_API_KEY;
    }
    // Basic validation - check if key is provided
    else if (!keyToUse) {
      setError('Please enter an API key or use the default key');
      return;
    }

    // Basic format check (Gemini keys are typically long alphanumeric strings)
    if (keyToUse.length < 10) {
      setError('API key format is invalid. Google API keys are typically longer.');
      return;
    }

    // Save the API key
    setApiKey(keyToUse);
    setError('');
    
    // Navigate to interview page
    navigate('/interview');
  };

  const handleClear = () => {
    clearApiKey();
    setInputKey('');
    setIsUsingDefault(false);
  };
  
  const useDefaultKey = () => {
    setInputKey(DEFAULT_API_KEY);
    setIsUsingDefault(true);
    setError('');
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
      <h1>Google Gemini API Key Setup</h1>
      
      <p style={{ marginBottom: '1.5rem' }}>
        To use the interview simulator, you need to provide your Google Gemini API key. 
        Your key will be stored locally in your browser and is never sent to our servers.
      </p>
      
      <div className="default-key-option" style={{ 
        marginBottom: '20px', 
        padding: '10px 15px', 
        backgroundColor: 'rgba(0, 120, 215, 0.1)', 
        borderRadius: '5px',
        border: '1px solid rgba(0, 120, 215, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '5px' }}>Use Default API Key</h3>
            <p style={{ fontSize: '0.9rem', marginBottom: '0' }}>
              A shared API key is provided for demonstration purposes.
            </p>
          </div>
          <button 
            type="button" 
            className="btn"
            onClick={useDefaultKey}
          >
            Use Default Key
          </button>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="apiKey">Your Gemini API Key (Optional):</label>
          <div style={{ display: 'flex' }}>
            <input
              type={showKey ? 'text' : 'password'}
              id="apiKey"
              className="form-select"
              value={inputKey}
              onChange={(e) => {
                setInputKey(e.target.value);
                setIsUsingDefault(e.target.value === DEFAULT_API_KEY);
              }}
              placeholder="Enter your Gemini API key or use default"
              style={{ flex: 1 }}
            />
            <button 
              type="button" 
              className="btn" 
              onClick={() => setShowKey(!showKey)}
              style={{ marginLeft: '10px' }}
            >
              {showKey ? 'Hide' : 'Show'}
            </button>
          </div>
          {error && <p style={{ color: 'var(--danger-color)', marginTop: '0.5rem' }}>{error}</p>}
          {isUsingDefault && (
            <p style={{ color: 'var(--accent-color)', marginTop: '0.5rem' }}>
              Using the default API key. This key has limited quota and may be rate-limited.
            </p>
          )}
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem' }}>
          {hasApiKey && (
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleClear}
            >
              Clear API Key
            </button>
          )}
          <button 
            type="submit" 
            className="btn"
            style={{ marginLeft: hasApiKey ? '10px' : 'auto' }}
          >
            {hasApiKey ? 'Update and Continue' : 'Save and Continue'}
          </button>
        </div>
      </form>
      
      <div style={{ marginTop: '2rem', fontSize: '0.9rem' }}>
        <h3>How to get a Google Gemini API key:</h3>
        <ol style={{ marginLeft: '1rem', lineHeight: '1.6' }}>
          <li>Go to <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
          <li>Sign in with your Google account</li>
          <li>Navigate to the API Keys section</li>
          <li>Create a new API key</li>
          <li>Copy the key and paste it here</li>
        </ol>
        <p style={{ marginTop: '1rem' }}>
          Note: Using the Gemini API may have usage limits and potential costs depending on your usage.
          <br />
          For more information, see <a href="https://ai.google.dev/pricing" target="_blank" rel="noopener noreferrer">Google's AI pricing page</a>.
        </p>
      </div>
    </div>
  );
};

export default ApiKeyPage; 