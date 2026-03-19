'use client';

import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';

// Replace with YOUR publishable key from Stripe Dashboard → Developers → API Keys
const stripePromise = loadStripe('pk_live_51T7Swj6U94KlWl4008aSHdfhdMZzZyHZ1awRgemz9mCCEq1ET47ERkT9yC0mX6FBgZ9hiG1ihLKD67UVoAqHxAei00MP9WYQp8');

interface MechanicSeatButtonProps {
  user: any; // Your Firebase user object
}

export function MechanicSeatButton({ user }: MechanicSeatButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const upgradeToMechanicSeat = async () => {
  if (!user) {
    alert('Please log in to upgrade');
    return;
  }

  try {
    const response = await fetch('https://us-central1-car-manual-ai-5c053.cloudfunctions.net/createCheckout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uid: user.uid })
    });

    const data = await response.json();
    console.log('Stripe response:', data); // Debug log
    
    if (data.sessionId) {
  // Build Stripe checkout URL manually
  window.location.href = `https://checkout.stripe.com/pay/${data.sessionId}`;
} else {
      alert('Upgrade failed: ' + (data.error || 'Unknown error'));
    }
  } catch (error) {
    console.error('Upgrade error:', error);
    alert('Upgrade failed - please try again');
  }
};

  return (
    <button
      onClick={upgradeToMechanicSeat}
      disabled={!user || isLoading}
      className="group relative w-full max-w-md mx-auto bg-gradient-to-r from-orange-500 via-red-500 to-orange-600 hover:from-orange-600 hover:via-red-600 hover:to-orange-700 text-white font-black py-6 px-10 rounded-3xl text-xl shadow-2xl hover:shadow-orange-500/50 transform hover:-translate-y-2 active:translate-y-0 transition-all duration-300 border-4 border-orange-400/50 hover:border-orange-300/70 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
    >
      {isLoading ? (
        <>
          <span className="flex items-center justify-center gap-2">
            🚀 Creating Checkout...
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </span>
        </>
      ) : user ? (
        <>
          🛠️ Mechanic Seat
          <span className="block text-lg font-normal mt-1 bg-white/10 px-3 py-1 rounded-xl backdrop-blur-sm">
            $39/mo - Unlimited Rusty AI
          </span>
        </>
      ) : (
        '🔒 Log In to Unlock'
      )}
    </button>
  );
}







