import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../App';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-stone-950/90 backdrop-blur-md border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img src="/logo.png" alt="Roomly" className="w-11 h-11 object-cover rounded-full ring-2 ring-amber-500/40" />
            <span
              className="text-stone-100 group-hover:text-amber-400 transition-colors"
              style={{ fontFamily: "'Great Vibes', cursive", fontSize: '2rem', lineHeight: 1 }}
            >
              Roomly
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`text-sm font-body transition-colors ${
                    isActive('/dashboard') ? 'text-amber-400' : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/studio"
                  className={`text-sm font-body transition-colors ${
                    isActive('/studio') ? 'text-amber-400' : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  Design Studio
                </Link>
                <Link
                  to="/ai-planner"
                  className={`text-sm font-body transition-colors ${
                    isActive('/ai-planner') ? 'text-amber-400' : 'text-stone-400 hover:text-stone-100'
                  }`}
                >
                  AI Planner
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-stone-800">
                  <span className="text-sm text-stone-400 font-body">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 text-xs bg-stone-800 hover:bg-stone-700 text-stone-300 rounded transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm text-stone-400 hover:text-stone-100 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-medium rounded transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-stone-400 hover:text-stone-100"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-stone-800 py-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link to="/dashboard" className="px-2 py-2 text-stone-300 hover:text-amber-400 text-sm" onClick={() => setMenuOpen(false)}>Dashboard</Link>
                <Link to="/studio" className="px-2 py-2 text-stone-300 hover:text-amber-400 text-sm" onClick={() => setMenuOpen(false)}>Design Studio</Link>
                <Link to="/ai-planner" className="px-2 py-2 text-stone-300 hover:text-amber-400 text-sm" onClick={() => setMenuOpen(false)}>AI Planner</Link>
                <button onClick={handleLogout} className="px-2 py-2 text-left text-red-400 text-sm">Logout</button>
              </>
            ) : (
              <>
                <Link to="/login" className="px-2 py-2 text-stone-300 text-sm" onClick={() => setMenuOpen(false)}>Sign In</Link>
                <Link to="/register" className="px-2 py-2 text-amber-400 text-sm font-medium" onClick={() => setMenuOpen(false)}>Get Started</Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
