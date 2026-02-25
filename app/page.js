'use client';

import { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';

export default function Home() {
  const [message, setMessage] = useState('Loading...');
  
  useEffect(() => {
    setMessage('✅ page.js = DYNAMIC REACT COMPONENT WORKING!');
  }, []);

  return (
    <div style={{ 
      padding: '40px', 
      maxWidth: '600px', 
      margin: '0 auto', 
      textAlign: 'center',
      fontFamily: 'system-ui'
    }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
        🚗 Car Manual AI
      </h1>
      <div style={{ 
        background: '#f0f9ff', 
        padding: '2rem', 
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <p style={{ fontSize: '1.2rem', color: '#0369a1' }}>
          {message}
        </p>
        <p style={{ color: '#64748b', fontSize: '1rem' }}>
          Build log should now show: <code>λ /</code> (dynamic)
        </p>
      </div>
      <button 
        style={{
          background: '#4285f4',
          color: 'white',
          border: 'none',
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          borderRadius: '8px',
          cursor: 'pointer'
        }}
        onClick={() => alert('Button works! Add Firebase next!')}
      >
        🚀 Test Button (Firebase coming)
      </button>
    </div>
  );
}
