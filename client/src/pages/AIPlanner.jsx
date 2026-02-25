import React, { useState, useEffect } from 'react';
import { getAISuggestions } from '../services/api';

const ROOM_TYPES = ['Living Room', 'Bedroom', 'Kitchen', 'Dining Room', 'Home Office', 'Bathroom', 'Studio Apartment'];
const STYLES = ['Modern Minimalist', 'Scandinavian', 'Industrial', 'Bohemian', 'Mid-Century Modern', 'Traditional', 'Contemporary', 'Art Deco'];

export default function AIPlanner() {
  const [form, setForm] = useState({
    roomType: 'Living Room',
    dimensions: { width: 5, length: 4, height: 2.7 },
    budget: 5000,
    style: 'Modern Minimalist'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isRateLimit, setIsRateLimit] = useState(false);
  const [countdown, setCountdown] = useState(0);

  // Countdown timer — starts when isRateLimit becomes true
  useEffect(() => {
    if (!isRateLimit || countdown <= 0) return;
    const id = setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
    return () => clearInterval(id);
  }, [isRateLimit]); // eslint-disable-line

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setIsRateLimit(false);
    setCountdown(0);
    setLoading(true);
    try {
      const { data } = await getAISuggestions(form);
      setResult(data.suggestions);
    } catch (err) {
      if (err.response?.status === 429) {
        setIsRateLimit(true);
        const secs = err.response?.data?.retryAfter || 60;
        setCountdown(secs);
      } else {
        const msg = err.response?.data?.message || err.message || 'AI request failed.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 pt-20 px-4 pb-16">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-xs text-amber-400 mb-4">
            <span>✦</span> Powered by Gemini AI
          </div>
          <h1 className="font-display text-4xl text-stone-100 mb-3">AI Design Assistant</h1>
          <p className="text-stone-500 max-w-lg">
            Describe your room requirements and receive professional interior design recommendations,
            color schemes, furniture lists, and budget guidance.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-6">
              <h2 className="font-display text-lg text-stone-100 mb-5">Room Details</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">Room Type</label>
                  <select
                    value={form.roomType}
                    onChange={(e) => setForm({ ...form, roomType: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 text-sm outline-none transition-colors"
                  >
                    {ROOM_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">Design Style</label>
                  <select
                    value={form.style}
                    onChange={(e) => setForm({ ...form, style: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 text-sm outline-none transition-colors"
                  >
                    {STYLES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-2 uppercase tracking-wider">
                    Budget: <span className="text-amber-400">${form.budget.toLocaleString()}</span>
                  </label>
                  <input
                    type="range"
                    min="500"
                    max="50000"
                    step="500"
                    value={form.budget}
                    onChange={(e) => setForm({ ...form, budget: parseInt(e.target.value) })}
                    className="w-full accent-amber-500"
                  />
                  <div className="flex justify-between text-xs text-stone-600 mt-1">
                    <span>$500</span><span>$50,000</span>
                  </div>
                </div>

                <div>
                  <label className="block text-stone-400 text-xs mb-2 uppercase tracking-wider">Dimensions (meters)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {['width', 'length', 'height'].map((dim) => (
                      <div key={dim}>
                        <label className="block text-stone-600 text-xs mb-1 capitalize">{dim}</label>
                        <input
                          type="number"
                          min="1"
                          max="30"
                          step="0.1"
                          value={form.dimensions[dim]}
                          onChange={(e) =>
                            setForm({ ...form, dimensions: { ...form.dimensions, [dim]: parseFloat(e.target.value) } })
                          }
                          className="w-full px-2 py-2 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 text-xs outline-none transition-colors"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-stone-950 font-medium rounded text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <><span>✦</span> Generate Design Plan</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-3">
            {isRateLimit && (
              <div className="bg-stone-900 border border-amber-800/50 rounded-lg p-6">
                <div className="flex items-start gap-4">
                  <div className="text-3xl leading-none mt-0.5">⚠️</div>
                  <div className="flex-1">
                    <h3 className="text-amber-400 font-medium mb-1">Gemini Free-Tier Quota Exhausted</h3>
                    <p className="text-stone-400 text-sm mb-4">
                      Your Gemini API free-tier quota has been used up for today. You can wait for the
                      daily reset or enable billing on Google AI Studio to continue immediately.
                    </p>
                    {countdown > 0 && (
                      <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin flex-shrink-0" />
                        <span className="text-stone-300 text-sm">
                          Estimated wait: <span className="font-mono text-amber-400">
                            {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
                          </span>
                        </span>
                      </div>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <a
                        href="https://aistudio.google.com"
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-medium rounded transition-colors"
                      >
                        Enable Billing on AI Studio ↗
                      </a>
                      <button
                        disabled={countdown > 0}
                        onClick={handleSubmit.bind(null, { preventDefault: () => {} })}
                        className="px-4 py-2 border border-stone-700 hover:border-stone-500 disabled:opacity-40 disabled:cursor-not-allowed text-stone-300 text-xs rounded transition-colors"
                      >
                        {countdown > 0 ? `Retry in ${countdown}s` : 'Try Again'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-4 bg-red-950/50 border border-red-800/50 rounded text-red-400 text-sm">
                {error}
              </div>
            )}

            {!result && !loading && !error && (
              <div className="bg-stone-900 border border-stone-800 border-dashed rounded-lg p-12 text-center">
                <div className="text-4xl mb-4 opacity-30">✦</div>
                <p className="text-stone-500 text-sm">
                  Fill in your room details and click "Generate Design Plan" to get AI-powered recommendations.
                </p>
              </div>
            )}

            {loading && (
              <div className="bg-stone-900 border border-stone-800 rounded-lg p-12 text-center">
                <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                <p className="text-stone-500 text-sm">Gemini AI is analyzing your requirements...</p>
              </div>
            )}

            {result && (
              <div className="space-y-4">
                {/* Layout */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
                  <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-3">Layout Suggestion</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{result.layoutSuggestion}</p>
                </div>

                {/* Color Scheme */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
                  <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-3">Color Scheme</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{result.colorScheme}</p>
                </div>

                {/* Furniture List */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
                  <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-3">Recommended Furniture</h3>
                  <ul className="space-y-2">
                    {Array.isArray(result.furnitureList) && result.furnitureList.map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-stone-300 text-sm">
                        <span className="text-amber-600 mt-0.5 flex-shrink-0">▸</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Budget Breakdown */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
                  <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-3">Budget Breakdown</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{result.budgetBreakdown}</p>
                </div>

                {/* Lighting */}
                <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
                  <h3 className="text-amber-400 text-xs uppercase tracking-wider mb-3">Lighting Suggestion</h3>
                  <p className="text-stone-300 text-sm leading-relaxed">{result.lightingSuggestion}</p>
                </div>

                <button
                  onClick={() => { setResult(null); setForm({ ...form }); }}
                  className="text-stone-500 hover:text-stone-300 text-xs transition-colors"
                >
                  ← Generate another plan
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
