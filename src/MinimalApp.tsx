import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import WorkingLogin from './WorkingLogin';

const MinimalDashboard = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        backgroundColor: '#2a2a2a',
        padding: '2rem',
        borderRadius: '8px',
        width: '100%',
        maxWidth: '600px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>DAORS Dashboard</h1>
        <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#9ca3af' }}>
          Welcome! You are successfully logged in.
        </p>
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={() => window.location.href = '/login'}
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

const MinimalApp = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<WorkingLogin />} />
        <Route path="/login" element={<WorkingLogin />} />
        <Route path="/portal" element={<MinimalDashboard />} />
        <Route path="*" element={<WorkingLogin />} />
      </Routes>
    </Router>
  );
};

export default MinimalApp;