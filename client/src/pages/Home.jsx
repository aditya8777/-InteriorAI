import React, { useEffect, useRef } from 'react';
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
  const videoRef = useRef(null);
  const heroRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!videoRef.current || !heroRef.current) return;
      const scrollY = window.scrollY;
      const heroHeight = heroRef.current.offsetHeight;
      // Parallax: video moves up at half the scroll speed and scales slightly
      const progress = Math.min(scrollY / heroHeight, 1);
      const translateY = scrollY * 0.4;
      const scale = 1 + progress * 0.15;
      const opacity = 1 - progress * 0.6;
      videoRef.current.style.transform = `translateY(${translateY}px) scale(${scale})`;
      videoRef.current.style.opacity = opacity;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-stone-950">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center px-4 overflow-hidden">
        {/* Background Video */}
        <video
          ref={videoRef}
          src="/bg-video.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover origin-center will-change-transform"
          style={{ transition: 'opacity 0.1s linear' }}
        />
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-stone-950/60 via-stone-950/50 to-stone-950" />
        {/* Amber tint accent */}
        <div className="absolute inset-0 bg-amber-900/10" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-stone-900 border border-stone-700 rounded-full text-xs text-amber-400 mb-6">
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

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-stone-400 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-amber-400">
            <path d="M10 3v14M10 17l-5-5M10 17l5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
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
        <p>© 2026 Roomly. Built with React, Three.js & Gemini AI.</p>
      </footer>
    </div>
  );
}
