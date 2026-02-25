'use client';

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

  if (loading) return <div>🔄 Loading Firebase...</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚗 Car Manual AI</h1>
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
            cursor: 'pointer'
          }}
        >
          🚀 Login with Google
        </button>
      ) : (
        <div>
          <p>✅ Logged in as: {user.email}</p>
          <button onClick={() => router.push('/manual')}>Go to Manual</button>
        </div>
      )}
    </div>
  );
}
