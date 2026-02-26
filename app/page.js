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

  // LOADING FIRST
  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-12 text-center border border-white/50">
        <div className="text-4xl mb-4">🔄 Loading Firebase...</div>
      </div>
    </div>
  );

  // MAIN LOGIN PAGE
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-8">
      <div className="bg-white/80 backdrop-blur-xl shadow-2xl rounded-3xl p-12 max-w-md w-full text-center border border-white/50">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-8">
          🚗 Car Manual AI
        </h1>
        
        {!user ? (
          <button 
            onClick={login}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-2xl text-xl shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200 border-0"
          >
            🚀 Login with Google
          </button>
        ) : (
          <div className="space-y-4">
            <p className="text-2xl font-semibold text-emerald-600 bg-emerald-100/50 px-4 py-2 rounded-xl">
              ✅ Logged in: {user.email}
            </p>
            <button 
              onClick={() => router.push('/manual')}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-200"
            >
              📖 Go to Car Manuals
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

