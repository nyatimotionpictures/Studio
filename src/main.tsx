import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRouter from './routes/Router';
import { BrowserRouter as Router } from 'react-router-dom';
import AuthProvider from './context/AuthProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </Router>
  </React.StrictMode>,
);
