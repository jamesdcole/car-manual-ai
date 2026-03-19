'use client';
import { MechanicSeatButton } from './mechanicseatbutton'; // We'll create this next

export default function SplashPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-6 py-24">
        {/* Hero */}
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">
            🛠️ Rusty AI
          </h1>
          <p className="text-2xl md:text-3xl text-slate-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Upload your OEM manual → Ask Rusty → Get exact specs instantly. 
            No dealership lookup delays.
          </p>
          
          {/* Rusty Demo */}
          <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl p-8 max-w-4xl mx-auto mb-16 border border-slate-700">
            <div className="text-xl md:text-2xl font-mono bg-slate-800 p-6 rounded-2xl mb-4">
              <strong>"**OIL: 0W-20 synthetic** - straight from factory. Don't put anything else in there unless you want that engine sounding like a coffee can full of bolts. Seen it a hundred times."</strong>
            </div>
            <p className="text-slate-400 italic">← Rusty on your Toyota manual</p>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-emerald-500/20 to-teal-500/20 backdrop-blur-xl border border-emerald-400/30 p-10 rounded-3xl hover:scale-[1.02] transition-all">
            <h3 className="text-3xl font-black mb-4 text-emerald-300">Free Trial</h3>
            <p className="text-xl mb-8 text-emerald-100">60 minutes - no card needed</p>
            <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-emerald-500/25 transition-all">
              Start Free Trial
            </button>
          </div>

          <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-xl border border-orange-400/30 p-10 rounded-3xl hover:scale-[1.02] transition-all">
            <h3 className="text-3xl font-black mb-4 text-orange-300">🛠️ Mechanic Seat</h3>
            <p className="text-xl mb-8 text-orange-100">$39/mo - Unlimited everything</p>
            <MechanicSeatButton user={null} />
          </div>
        </div>
      </div>
    </div>
  );
}

















