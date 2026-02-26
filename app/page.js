'use client';

export const dynamic = "force-dynamic";

import { useState, useEffect } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const provider = new GoogleAuthProvider();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
      if (currentUser) router.push('/manual');
    });
    return unsubscribe;
  }, [router]);

  const login = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  if (loading) return <div style={{padding: '40px', textAlign: 'center'}}>🔄 Loading Firebase...</div>;

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
      {!user ? (
        <button 
          onClick={login}
          style={{
            background: '#4285f4',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          🚀 Login with Google
        </button>
      ) : (
        <div>
          <p style={{ fontSize: '1.2rem', color: '#10b981' }}>
            ✅ Logged in as: {user.email}
          </p>
          <button 
            onClick={() => router.push('/manual')}
            style={{
              background: '#10b981',
              color: 'white',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '1rem'
            }}
          >
            📖 Go to Car Manuals
          </button>
        </div>
      )}
    </div>
  );
}
