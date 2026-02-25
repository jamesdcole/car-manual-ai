'use client';
import { useAuth } from '@/hooks/useAuth';

export default function Home() {
  const { user, loading, loginWithGoogle, logout } = useAuth();

  if (loading) return <div style={{padding:'50px', textAlign:'center', fontSize:'24px'}}>🔄 Loading Firebase...</div>;

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{fontSize: '48px', marginBottom: '30px'}}>🚗 Car Manual AI</h1>
      
      {user ? (
        <div>
          <p style={{fontSize: '24px', color: '#10b981', marginBottom: '30px'}}>
            ✅ Logged in: {user.email}
          </p>
          <button onClick={logout} style={{padding: '15px 40px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '12px', fontSize: '18px'}}>
            Logout
          </button>
        </div>
      ) : (
        <button 
          onClick={loginWithGoogle}
          style={{padding: '20px 50px', background: '#4285f4', color: 'white', border: 'none', borderRadius: '16px', fontSize: '20px'}}
        >
          🚀 Login with Google
        </button>
      )}
    </div>
  );
}
