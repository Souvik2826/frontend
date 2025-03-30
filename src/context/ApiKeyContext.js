import React, { createContext, useContext } from 'react';

// Create the context
const ApiKeyContext = createContext();

// Default API key - hardcoded
const DEFAULT_API_KEY = "AIzaSyBFNNQBFTYN4uBi1-V-4b9-K-mo1X7vpHc";

// Custom hook to use the API key context
export const useApiKey = () => useContext(ApiKeyContext);

// Provider component
export const ApiKeyProvider = ({ children }) => {
  // Always use the default API key - no user-configurable API key
  const apiKey = DEFAULT_API_KEY;

  // Value provided by the context
  const value = {
    apiKey,
    setApiKey: () => {}, // Empty function - no ability to change
    clearApiKey: () => {}, // Empty function - nothing to clear
    hasApiKey: true, // Always true
  };

  return (
    <ApiKeyContext.Provider value={value}>
      {children}
    </ApiKeyContext.Provider>
  );
}; 