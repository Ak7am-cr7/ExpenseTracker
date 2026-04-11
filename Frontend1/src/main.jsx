import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client'; 
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

// We use ReactDOM.createRoot to start the app
ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
        <App />
    </ThemeProvider>
  </StrictMode>
);