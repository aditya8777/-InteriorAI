import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getRooms, deleteRoom, createRoom } from '../services/api';
import { useAuth } from '../App';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newRoom, setNewRoom] = useState({ name: '', width: 5, length: 4, height: 2.7 });

  const fetchRooms = useCallback(async () => {
    try {
      const { data } = await getRooms();
      setRooms(data);
    } catch (err) {
      setError('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchRooms(); }, [fetchRooms]);

  const handleDelete = async (id, e) => {
    e.preventDefault();
    if (!window.confirm('Delete this room design?')) return;
    try {
      await deleteRoom(id);
      setRooms(rooms.filter((r) => r._id !== id));
    } catch {
      alert('Failed to delete room');
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newRoom.name.trim()) return;
    setCreating(true);
    try {
      const { data } = await createRoom({
        name: newRoom.name,
        dimensions: {
          width: parseFloat(newRoom.width),
          length: parseFloat(newRoom.length),
          height: parseFloat(newRoom.height)
        },
        furniture: []
      });
      navigate(`/studio/${data._id}`);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create room');
    } finally {
      setCreating(false);
    }
  };

  const totalCost = rooms.reduce((sum, r) => sum + (r.totalCost || 0), 0);
  const totalFurniture = rooms.reduce((sum, r) => sum + (r.furniture?.length || 0), 0);

  return (
    <div className="min-h-screen bg-stone-950 pt-20 px-4 pb-16">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-display text-3xl text-stone-100">My Designs</h1>
            <p className="text-stone-500 text-sm mt-1">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-medium rounded transition-colors"
          >
            <span>+</span> New Room Design
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Rooms', value: rooms.length },
            { label: 'Furniture Items', value: totalFurniture },
            { label: 'Total Value', value: `$${totalCost.toLocaleString()}` }
          ].map((stat, i) => (
            <div key={i} className="bg-stone-900 border border-stone-800 rounded-lg p-5">
              <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{stat.label}</p>
              <p className="font-display text-2xl text-stone-100">{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <Link
            to="/ai-planner"
            className="flex items-center gap-4 p-5 bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-lg transition-colors group"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded flex items-center justify-center text-amber-400 text-xl">✦</div>
            <div>
              <p className="text-stone-100 text-sm font-medium group-hover:text-amber-400 transition-colors">AI Design Assistant</p>
              <p className="text-stone-500 text-xs">Get Gemini-powered room recommendations</p>
            </div>
          </Link>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-4 p-5 bg-stone-900 border border-stone-800 hover:border-amber-500/50 rounded-lg transition-colors group w-full text-left"
          >
            <div className="w-10 h-10 bg-amber-500/10 rounded flex items-center justify-center text-amber-400 text-xl">⬛</div>
            <div>
              <p className="text-stone-100 text-sm font-medium group-hover:text-amber-400 transition-colors">Design Studio</p>
              <p className="text-stone-500 text-xs">Start a new room from scratch</p>
            </div>
          </button>
        </div>

        {/* Rooms List */}
        {error && (
          <div className="p-4 bg-red-950/50 border border-red-800/50 rounded text-red-400 text-sm mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center py-20 bg-stone-900 border border-stone-800 rounded-lg">
            <p className="font-display text-2xl text-stone-400 mb-3">No designs yet</p>
            <p className="text-stone-600 text-sm mb-6">Create your first room design to get started</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 text-sm font-medium rounded transition-colors"
            >
              Create First Room
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rooms.map((room) => (
              <Link
                key={room._id}
                to={`/studio/${room._id}`}
                className="block bg-stone-900 border border-stone-800 hover:border-stone-600 rounded-lg overflow-hidden transition-colors group"
              >
                {/* Room Preview */}
                <div className="h-36 bg-stone-950 relative overflow-hidden"
                  style={{
                    backgroundImage: 'linear-gradient(#292524 1px, transparent 1px), linear-gradient(90deg, #292524 1px, transparent 1px)',
                    backgroundSize: '16px 16px'
                  }}
                >
                  <div className="absolute inset-4 border border-amber-700/30 rounded-sm" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-stone-700 text-xs">
                      {room.dimensions?.width}m × {room.dimensions?.length}m
                    </span>
                  </div>
                  {room.furniture?.slice(0, 6).map((f, i) => (
                    <div
                      key={i}
                      className="absolute w-6 h-5 bg-amber-700/30 border border-amber-600/30 rounded-sm"
                      style={{
                        left: `${15 + (i % 3) * 25}%`,
                        top: `${20 + Math.floor(i / 3) * 40}%`
                      }}
                    />
                  ))}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-display text-stone-100 text-base group-hover:text-amber-400 transition-colors truncate">
                      {room.name}
                    </h3>
                    <button
                      onClick={(e) => handleDelete(room._id, e)}
                      className="text-stone-600 hover:text-red-400 transition-colors ml-2 flex-shrink-0"
                      title="Delete room"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-stone-500">
                    <span>{room.furniture?.length || 0} items</span>
                    <span>·</span>
                    <span>${(room.totalCost || 0).toLocaleString()}</span>
                    <span>·</span>
                    <span>{new Date(room.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && setShowCreateModal(false)}
        >
          <div className="bg-stone-900 border border-stone-700 rounded-lg p-7 w-full max-w-md">
            <h2 className="font-display text-xl text-stone-100 mb-6">New Room Design</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">Room Name</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="e.g. Living Room, Master Bedroom"
                  required
                  className="w-full px-4 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {['width', 'length', 'height'].map((dim) => (
                  <div key={dim}>
                    <label className="block text-stone-400 text-xs mb-1.5 uppercase tracking-wider">{dim} (m)</label>
                    <input
                      type="number"
                      min="1"
                      max="50"
                      step="0.1"
                      value={newRoom[dim]}
                      onChange={(e) => setNewRoom({ ...newRoom, [dim]: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 text-sm outline-none transition-colors"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 py-2.5 border border-stone-700 text-stone-400 hover:text-stone-100 rounded text-sm transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-stone-950 font-medium rounded text-sm transition-colors"
                >
                  {creating ? 'Creating...' : 'Create & Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
