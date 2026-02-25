import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as loginAPI } from '../services/api';
import { useAuth } from '../App';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginAPI(form);
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-stone-100 mb-2">Welcome back</h1>
          <p className="text-stone-500 text-sm">Sign in to your design workspace</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-lg p-8">
          {error && (
            <div className="mb-5 p-3 bg-red-950/50 border border-red-800/50 rounded text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 disabled:cursor-not-allowed text-stone-950 font-medium rounded transition-colors text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-6 text-stone-500 text-sm">
            Don't have an account?{' '}
            <Link to="/register" className="text-amber-400 hover:text-amber-300">
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
