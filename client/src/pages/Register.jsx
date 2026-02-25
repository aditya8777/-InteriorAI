import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as registerAPI } from '../services/api';
import { useAuth } from '../App';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      return setError('Passwords do not match');
    }
    if (form.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      const { data } = await registerAPI({
        name: form.name,
        email: form.email,
        password: form.password
      });
      login(data.user, data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center px-4 pt-16">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl text-stone-100 mb-2">Create your account</h1>
          <p className="text-stone-500 text-sm">Start designing beautiful spaces today</p>
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
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Jane Smith"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
              />
            </div>

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
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
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
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-stone-500 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-400 hover:text-amber-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
