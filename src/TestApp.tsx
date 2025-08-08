import React from 'react';

const TestApp = () => {
  return (
    <div style={{ 
      padding: '20px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a',
      color: '#ffffff',
      minHeight: '100vh'
    }}>
      <h1>DAORS Flow Motion - Test Page</h1>
      <p>If you can see this, React is working!</p>
      <div style={{ marginTop: '20px' }}>
        <h2>System Status:</h2>
        <ul>
          <li>✅ React is rendering</li>
          <li>✅ Basic styling is working</li>
          <li>✅ Component structure is correct</li>
        </ul>
      </div>
      <div style={{ marginTop: '20px' }}>
        <a 
          href="/login" 
          style={{ 
            color: '#60a5fa', 
            textDecoration: 'none',
            padding: '10px 20px',
            border: '1px solid #60a5fa',
            borderRadius: '4px',
            display: 'inline-block'
          }}
        >
          Go to Login Page
        </a>
      </div>
    </div>
  );
};

export default TestApp;