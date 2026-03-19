'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
// ❌ REMOVE: import { MechanicSeatButton } from '@/components/mechanicseatbutton';

export default function SplashPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
  if (!loading && user && !signingOut) {
    // 👈 ADD DELAY - lets buttons render first
    const timer = setTimeout(() => {
      router.push('/login');
    }, 2000); // 2 seconds
    return () => clearTimeout(timer);
  }
}, [loading, user, router, signingOut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-xl font-semibold text-slate-400 animate-pulse">Loading GarageOEMai...</div>
      </div>
    );
  }

  if (user && !signingOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 gap-6 p-8">
        <div className="text-4xl font-bold text-white mb-8 animate-pulse">Welcome back!</div>
        <button
          onClick={() => router.push('/login')}
          className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50"
        >
          🚀 Go to Manuals
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white overflow-hidden">
      <section className="relative max-w-6xl mx-auto px-4 pt-12 pb-20 text-center">
        <div className="inline-flex items-center px-6 py-3 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl mb-8 mx-auto w-fit backdrop-blur-xl shadow-2xl">
          <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
          <span className="text-lg font-bold uppercase tracking-wide">Built for Independent Garages</span>
        </div>

        <h1 className="text-5xl md:text-[5rem] lg:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-orange-200 bg-clip-text text-transparent leading-[0.9] mb-6 tracking-tight">
          AI That Reads Your<br />
          <span className="text-transparent bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text">
            OEM Manuals
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
          Upload OEM service manuals. Ask "head bolt torque?" or "P0301 flow?" Get{' '}
          <strong>exact OEM procedures instantly</strong> - no page flipping required.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16 max-w-2xl mx-auto">
          {/* ✅ REGULAR BUTTON - NOT MechanicSeatButton */}
          <button
            onClick={() => router.push('/login')}
            className="group w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transform hover:-translate-y-2 transition-all duration-300 flex items-center justify-center gap-3"
          >
            🚀 Launch Mechanic Seat
            <span className="text-lg opacity-90">(7 Day Free Trial)</span>
          </button>
          <button
            onClick={() => router.push('/login')}
            className="px-10 py-5 border-2 border-slate-700 hover:border-emerald-500 text-lg font-semibold rounded-3xl hover:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
          >
            Sign In → Continue
          </button>
        </div>

        <div className="flex flex-wrap gap-8 justify-center text-sm text-slate-400 items-center">
          <span>⚙️ Any OEM PDF</span>
          <span>•</span>
          <span>📱 Phone-first</span>
          <span>•</span>
          <span>🛠️ Shop-built</span>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="group bg-slate-900/60 backdrop-blur-xl p-10 rounded-3xl border-2 border-slate-800/50 hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300">
            <h3 className="text-3xl font-black mb-6 text-emerald-400">🚗 7 Day Free Trial</h3>
            <p className="text-4xl font-black mb-4">$0</p>
            <p className="text-xl mb-8 text-slate-300">Test 3 manuals with full AI</p>
            {/* ✅ REGULAR BUTTON */}
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-xl font-bold px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/50"
            >
              Launch 7 Day Free Trial
            </button>
          </div>
          
          <div className="relative group bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-500/10 backdrop-blur-xl p-10 rounded-3xl border-2 border-orange-400/50 shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
            <div className="absolute -top-2 -right-4 bg-orange-400/90 text-black px-6 py-2 rounded-2xl text-lg font-bold rotate-3 transform">
              Most Popular
            </div>
            <h3 className="text-3xl font-black mb-6 text-orange-300">🛠️ Mechanic Seat</h3>
            <p className="text-4xl font-black mb-4 text-orange-100">$39/mo</p>
            <p className="text-xl mb-8 text-orange-100">Unlimited manuals + AI (Rusty)</p>
            {/* ✅ REGULAR BUTTON - NO MechanicSeatButton */}
            <button 
              onClick={() => router.push('/login')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-xl font-bold px-8 py-5 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-orange-500/50"
            >
              Launch Mechanic Seat
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}