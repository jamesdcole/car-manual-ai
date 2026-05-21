'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function SplashPage() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  // 👇 Block‑user‑loop: send to /login after ~2s
  useEffect(() => {
    if (!loading && user && !signingOut) {
      const timer = setTimeout(() => {
        router.push('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [loading, user, router, signingOut]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900">
        <div className="text-xl font-semibold text-slate-400 animate-pulse">
          Loading GarageOEMai...
        </div>
      </div>
    );
  }

  // 👇 Already signed in: warm welcome, big “Go to Manuals”
  if (user && !signingOut) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 gap-6 p-8">
        <div className="text-4xl font-bold text-white mb-6 animate-pulse">
          Welcome back!
        </div>
        <button
          onClick={() => router.push('/login')}
          className="px-10 py-5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 text-white"
        >
          🚀 Go to Manuals
        </button>
      </div>
    );
  }

// 👇 Splash: hero + value prop + buttons + pricing + FAQ + testimonials
return (
  <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-orange-950 text-white overflow-x-hidden">
    {/* 1. Hero */}
    <section className="relative max-w-5xl mx-auto px-4 pt-16 pb-16 text-center">
      <div className="inline-flex items-center px-6 py-3 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-2xl mb-8 mx-auto w-fit backdrop-blur-xl shadow-2xl">
        <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full mr-3 animate-pulse"></span>
        <span className="text-lg font-bold uppercase tracking-wide">Built for Independent Garages</span>
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-slate-100 to-orange-200 bg-clip-text text-transparent leading-tight mb-6 tracking-tight">
        AI That Reads Your
        <br />
        <span className="text-transparent bg-gradient-to-r from-emerald-400 to-orange-400 bg-clip-text">
          OEM Manuals
        </span>
      </h1>

      <p className="text-lg sm:text-xl text-slate-300 max-w-2xl md:max-w-3xl mx-auto mb-10 leading-relaxed">
        Upload OEM service manuals. Ask{" "}
        <strong className="text-white">
          "head bolt torque?" or "P0301 flow?"
        </strong>{" "}
        and get OEM‑level procedures instantly — no page flipping.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12 max-w-2xl mx-auto">
        <button
          onClick={() => router.push('/login')}
          className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-xl font-bold rounded-3xl shadow-2xl hover:shadow-emerald-500/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
        >
          🚀 Launch 7‑Day Free Trial
        </button>
        <button
          onClick={() => router.push('/login')}
          className="px-8 py-4 border-2 border-slate-700 hover:border-emerald-500 text-lg font-semibold rounded-3xl hover:bg-slate-900/50 backdrop-blur-sm transition-all duration-300 flex items-center justify-center"
        >
          Sign In → Continue
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center text-sm text-slate-400">
        <span>⚙️ Any OEM PDF</span>
        <span>•</span>
        <span>📱 Phone‑first</span>
        <span>•</span>
        <span>🛠️ Shop‑built</span>
      </div>
    </section>

    {/* 2. Pricing cards */}
    <section className="max-w-4xl mx-auto px-4 pb-16">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="group bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border-2 border-slate-800/50 hover:border-emerald-500/50 hover:-translate-y-2 transition-all duration-300">
          <h3 className="text-2xl sm:text-3xl font-black mb-6 text-emerald-400">🚗 7 Day Free Trial</h3>
          <p className="text-4xl font-black mb-4">$0</p>
          <p className="text-lg sm:text-xl mb-8 text-slate-300">
            Test up to 3 manuals with full AI access.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-xl font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-emerald-500/50"
          >
            Launch 7‑Day Free Trial
          </button>
        </div>

        <div className="relative group bg-gradient-to-br from-orange-500/20 via-red-500/20 to-orange-500/10 backdrop-blur-xl p-8 sm:p-10 rounded-3xl border-2 border-orange-400/50 shadow-2xl hover:shadow-orange-500/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden">
          <div className="absolute -top-2 -right-4 bg-orange-400/90 text-black px-6 py-2 rounded-2xl text-lg font-bold rotate-3 transform">
            Most Popular
          </div>
          <h3 className="text-2xl sm:text-3xl font-black mb-6 text-orange-300">🛠️ Mechanic Seat</h3>
          <p className="text-4xl font-black mb-4 text-orange-100">$39/mo</p>
          <p className="text-lg sm:text-xl mb-8 text-orange-100">
            Unlimited manuals + AI (Rusty). Perfect for daily use.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="w-full bg-orange-500 hover:bg-orange-600 text-xl font-bold px-8 py-4 rounded-2xl transition-all duration-300 shadow-xl hover:shadow-orange-500/50"
          >
            Launch Mechanic Seat
          </button>
        </div>
      </div>
    </section>

    {/* 3. FAQ accordion */}
    <FaqAccordion />

        {/* 4. Testimonials section */}
    <TestimonialsSection router={router} />

    {/* Footer line */}
    <div className="text-center text-slate-500 text-sm py-4 border-t border-slate-800/50">
      GarageOEMAI • Built for independent garages
    </div>
  </div>
);
}

// 👇 FAQ Accordion component
function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqItems = [
    {
      question: "How does GarageOEMAI work?",
      answer:
        "You upload your vehicle’s OEM service manual as a PDF. Then you ask questions like 'head bolt torque?' or 'P0301 flow?' and GarageOEMAI gives you the exact OEM‑style step‑by‑step answer powered by Rusty‑AI.",
    },
    {
      question: "What kind of manuals can I upload?",
      answer:
        "Most OEM PDF service manuals: repair manuals, diagnostic procedures, TSBs, and technical guides. Just upload the PDF, and GarageOEMAI indexes all the steps and torque specs for you.",
    },
    {
      question: "Is there a free trial?",
      answer:
        "Yes — every new account gets a 7‑day free trial with no credit card required. You can test 3 manuals during the trial to see how the AI works.",
    },
    {
      question: "Do I need technical experience to use it?",
      answer:
        "No. GarageOEMAI is designed for DIYers, hobbyists, and professional mechanics alike. You ask questions in plain language, and the AI returns clear, OEM‑style answers.",
    },
    {
      question: "How fast are the answers?",
      answer:
        "Once your manual is indexed, answers typically appear in a few seconds. You can ask as many questions as you want during the trial or on the Mechanic Seat plan.",
    },
    {
      question: "Is my data private and secure?",
      answer:
        "Your manuals are stored securely in your Firebase project. GarageOEMAI does not share your manuals or private data with third parties unless you explicitly choose to export or share.",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900/80 to-slate-950 py-12 sm:py-16 md:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">
          🧩 Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqItems.map((item, index) => (
            <details
              key={index}
              open={openIndex === index}
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="ring-1 ring-slate-700 rounded-xl bg-slate-900/60 backdrop-blur-xl"
            >
              <summary className="flex items-center justify-between p-4 text-lg font-semibold text-white cursor-pointer select-none">
                {item.question}
                <span className="ml-2 text-orange-300">
                  {openIndex === index ? "−" : "+"}
                </span>
              </summary>
              <div className="px-4 pb-4 pt-2 text-slate-300 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

// 👇 NEW: Testimonials section (outside of the JSX tree, inside the same file)
function TestimonialsSection({ router }: { router: ReturnType<typeof useRouter> }) {
  const testimonials = [
    {
      text: "My new hire learned garage manuals in days instead of months. Within a week he was doing senior‑mechanic‑level work on a daily basis.",
      author: "Mike, Independent Garage Owner",
    },
    {
      text: "This app saves me hundreds of dollars a day in saved time. It’s well worth the $39/month — every smart garage owner should be using it.",
      author: "Jamie, Mechanics & Co.",
    },
    {
      text: "GarageOEMAI is the one tool my shop can’t live without. It pays for itself in the first week.",
      author: "Raj, Metro Repair Center",
    },
  ];

  return (
    <section className="bg-gradient-to-b from-slate-900/60 to-slate-950 py-12 sm:py-16 md:py-20 border-t border-slate-800/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10 text-white">
          🛠️ Loved by Independent Garages
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, index) => (
            <div
              key={index}
              className="bg-slate-900/60 backdrop-blur-xl p-6 sm:p-7 rounded-2xl border border-slate-700/50 shadow-lg"
            >
              <p className="text-slate-200 text-base sm:text-lg leading-relaxed mb-4 italic">
                “{item.text}”
              </p>
              <p className="text-slate-400 text-sm font-semibold">
                — {item.author}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <button
            onClick={() => router.push('/login')}
            className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-lg font-bold rounded-2xl shadow-xl hover:shadow-emerald-500/50 transition-all duration-300"
          >
            Start Your 7‑Day Free Trial
          </button>
        </div>
      </div>
    </section>
  );
}