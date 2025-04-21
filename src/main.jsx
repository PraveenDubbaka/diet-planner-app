// Ensure Firebase configuration is loaded (includes auth persistence setup)
import './firebase/config';
import { authReady } from './firebase/config';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme/index.js';
import ErrorBoundary from './components/ErrorBoundary';

// Wait for Firebase auth persistence to be set before rendering the app
authReady.then(() => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <ErrorBoundary>
        <BrowserRouter>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </BrowserRouter>
      </ErrorBoundary>
    </React.StrictMode>
  );
}).catch(error => {
  console.error("Firebase initialization error:", error);
  // Render a minimal error message if Firebase fails to initialize
  ReactDOM.createRoot(document.getElementById('root')).render(
    <div style={{ 
      padding: '20px', 
      margin: '20px', 
      border: '1px solid #f5c6cb',
      borderRadius: '4px',
      backgroundColor: '#f8d7da', 
      color: '#721c24'
    }}>
      <h2>Application Failed to Load</h2>
      <p>There was a problem connecting to the backend services. Please try again later.</p>
      <details>
        <summary>Technical Details</summary>
        <pre>{error?.message || "Unknown initialization error"}</pre>
      </details>
      <button
        onClick={() => window.location.reload()}
        style={{ 
          marginTop: '15px',
          padding: '8px 15px',
          backgroundColor: '#dc3545',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Reload Page
      </button>
    </div>
  );
});