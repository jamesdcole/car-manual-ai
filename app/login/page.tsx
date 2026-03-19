'use client';
import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert('Verification email sent! Check your inbox.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        router.push('/manual');
      }
    } catch (error) {
      alert(error.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-500 via-red-500 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl p-12 rounded-3xl border border-white/20 max-w-md w-full">
        <h1 className="text-4xl font-black text-center mb-8 text-white">
          {isSignUp ? '🚗 Sign Up' : '🔑 Sign In'}
        </h1>
        
        <form onSubmit={handleAuth} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-orange-400"
            required
          />
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-orange-500 to-yellow-500 text-xl font-bold py-4 px-8 rounded-2xl hover:from-orange-600 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? 'Loading...' : isSignUp ? 'Create Account' : 'Sign In'}
          </button>
        </form>
        
        <p className="text-center mt-6 text-white/80">
          {isSignUp ? 'Already have account?' : "Don't have account?"}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-1 text-orange-300 font-bold hover:text-orange-200"
          >
            {isSignUp ? ' Sign In' : ' Sign Up'}
          </button>
        </p>
        
        <button
          onClick={() => router.push('/')}
          className="w-full mt-4 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-8 rounded-xl border border-white/30 transition-all duration-300"
        >
          ← Back to Home
        </button>
      </div>
    </div>
  );
}