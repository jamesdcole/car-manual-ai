'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🚗 Car Manual AI</h1>
      
      {user ? (
        <>
          <p>✅ Logged in as: {user.email}</p>
          <button 
            onClick={logout}
            style={{
              padding: '12px 24px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </>
      ) : (
        <button 
          onClick={loginWithGoogle}
          style={{
            padding: '12px 24px',
            background: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          🚀 Login with Google
        </button>
      )}
    </div>
  );
}














