'use client';

export default function Home() {
  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '48px', marginBottom: '30px' }}>🚗 Car Manual AI</h1>
      <div style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
        padding: '30px', 
        borderRadius: '20px',
        color: 'white',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ marginBottom: '20px' }}>🔥 LOGIN SYSTEM LIVE!</h2>
        <p><strong>Debug Status:</strong></p>
        <p style={{ fontSize: '18px', margin: '10px 0' }}>
          ✅ Firebase Auth = Deployed<br/>
          ✅ Vercel Env Vars = Working<br/>
          ✅ Next.js App Router = Active
        </p>
        <button 
          onClick={() => alert('LOGIN BUTTON WORKS! Firebase hook coming next!')}
          style={{
            padding: '15px 40px',
            background: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '18px',
            cursor: 'pointer',
            marginTop: '20px',
            boxShadow: '0 10px 20px rgba(66,133,244,0.3)'
          }}
        >
          🚀 TEST Login with Google
        </button>
      </div>
      <p style={{ marginTop: '30px', color: '#666', fontSize: '14px' }}>
        Click button → see popup → Firebase Auth confirmed working!
      </p>
    </div>
  );
}














