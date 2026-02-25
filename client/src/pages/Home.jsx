import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../App';

const features = [
  {
    icon: '⬛',
    title: '2D Room Planner',
    desc: 'Drag, drop, rotate and precisely position furniture on a grid-based canvas.'
  },
  {
    icon: '◻️',
    title: '3D Visualization',
    desc: 'Instantly render your room in 3D with orbit controls and dynamic lighting.'
  },
  {
    icon: '✦',
    title: 'AI Design Assistant',
    desc: 'Get intelligent layout, color, and furniture recommendations powered by Gemini.'
  },
  {
    icon: '◈',
    title: 'Budget Calculator',
    desc: 'Real-time cost tracking with item-wise breakdowns and tax calculations.'
  },
  {
    icon: '⟐',
    title: 'Furniture Catalog',
    desc: 'Browse curated furniture across 6 categories with color variants and pricing.'
  },
  {
    icon: '⊡',
    title: 'Cloud Storage',
    desc: 'Save, update and manage multiple room designs securely in the cloud.'
  }
];

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-72 h-72 bg-amber-600/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-full bg-gradient-to-b from-transparent via-stone-700/20 to-transparent" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-full text-xs text-amber-400 mb-8">
            <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" />
            AI-Powered Interior Design Platform
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl text-stone-100 leading-tight mb-6">
            Design Spaces That
            <br />
            <span className="text-amber-400">Inspire Living</span>
          </h1>

          <p className="text-stone-400 text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Plan, visualize, and perfect your interior design with 2D floor planning,
            3D rendering, and AI-powered design recommendations — all in one platform.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                to="/dashboard"
                className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium rounded transition-colors text-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium rounded transition-colors text-sm"
                >
                  Start Designing Free
                </Link>
                <Link
                  to="/login"
                  className="px-8 py-3.5 border border-stone-700 hover:border-stone-500 text-stone-300 hover:text-stone-100 rounded transition-colors text-sm"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Room Preview Mockup */}
        <div className="max-w-4xl mx-auto mt-20 relative">
          <div className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden shadow-2xl">
            <div className="flex items-center gap-2 px-4 py-3 bg-stone-800 border-b border-stone-700">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <span className="text-stone-500 text-xs ml-2">InteriorAI — Design Studio</span>
            </div>
            <div className="h-64 bg-stone-900 flex items-center justify-center relative">
              {/* Simulated 2D grid */}
              <div className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(#d6d3d1 1px, transparent 1px), linear-gradient(90deg, #d6d3d1 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="relative grid grid-cols-3 gap-8 p-8">
                <div className="w-24 h-16 bg-amber-700/40 border border-amber-600/50 rounded flex items-center justify-center text-amber-500/70 text-xs">Sofa</div>
                <div className="w-16 h-16 bg-stone-700/60 border border-stone-600/50 rounded flex items-center justify-center text-stone-400/70 text-xs">Table</div>
                <div className="w-20 h-12 bg-stone-600/40 border border-stone-500/50 rounded flex items-center justify-center text-stone-400/70 text-xs">Chair</div>
                <div className="w-32 h-20 bg-stone-700/40 border border-stone-600/50 rounded flex items-center justify-center text-stone-400/70 text-xs">Bed</div>
                <div className="w-12 h-12 bg-amber-900/30 border border-amber-700/40 rounded flex items-center justify-center text-amber-600/70 text-xs">Lamp</div>
                <div className="w-20 h-14 bg-stone-600/30 border border-stone-500/40 rounded flex items-center justify-center text-stone-500/70 text-xs">Decor</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-4 border-t border-stone-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-display text-3xl sm:text-4xl text-stone-100 mb-4">
              Everything You Need to Design
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto">
              A complete suite of professional design tools, accessible from your browser.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="p-6 bg-stone-900 border border-stone-800 rounded-lg hover:border-stone-700 transition-colors group"
              >
                <div className="text-2xl mb-4">{f.icon}</div>
                <h3 className="font-display text-lg text-stone-100 mb-2 group-hover:text-amber-400 transition-colors">
                  {f.title}
                </h3>
                <p className="text-stone-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 border-t border-stone-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-display text-3xl sm:text-4xl text-stone-100 mb-6">
            Start Designing Today
          </h2>
          <p className="text-stone-500 mb-8">
            Create your first room design in minutes. No credit card required.
          </p>
          {!user && (
            <Link
              to="/register"
              className="inline-block px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-medium rounded transition-colors text-sm"
            >
              Create Free Account
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-stone-900 px-4 text-center text-stone-600 text-sm">
        <p>© 2026 InteriorAI. Built with React, Three.js & Gemini AI.</p>
      </footer>
    </div>
  );
}
