import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, updateRoom, getFurniture } from '../services/api';
import RoomPlanner2D from '../components/RoomPlanner2D';
import RoomViewer3D from '../components/RoomViewer3D';
import FurnitureCatalog from '../components/FurnitureCatalog';
import BudgetCalculator from '../components/BudgetCalculator';

const TABS = ['2D Planner', '3D View', 'Furniture', 'Budget'];

export default function DesignStudio() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [placedFurniture, setPlacedFurniture] = useState([]);
  const [activeTab, setActiveTab] = useState('2D Planner');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const [roomRes, furnitureRes] = await Promise.all([
        roomId ? getRoomById(roomId) : Promise.resolve(null),
        getFurniture()
      ]);
      if (roomRes) {
        setRoom(roomRes.data);
        setPlacedFurniture(roomRes.data.furniture || []);
      }
      setFurniture(furnitureRes.data);
    } catch (err) {
      setError(roomId ? 'Failed to load room' : 'Failed to load furniture');
    } finally {
      setLoading(false);
    }
  }, [roomId]);

  useEffect(() => {
    if (!roomId) {
      navigate('/dashboard');
      return;
    }
    loadData();
  }, [roomId, loadData, navigate]);

  const handleSave = async () => {
    if (!room) return;
    setSaving(true);
    setSaveMsg('');
    try {
      const totalCost = placedFurniture.reduce((sum, f) => sum + (f.price || 0), 0);
      await updateRoom(room._id, { furniture: placedFurniture, totalCost });
      setSaveMsg('Saved!');
      setTimeout(() => setSaveMsg(''), 2500);
    } catch {
      setSaveMsg('Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleAddFurniture = (item, color) => {
    const placed = {
      _id: Date.now().toString(),
      furnitureId: item._id,
      name: item.name,
      category: item.category,
      price: item.price,
      color: color || item.colorOptions?.[0] || '#8B7355',
      x: 50,
      y: 50,
      rotation: 0,
      width: Math.min(item.dimensions?.width || 100, 150),
      depth: Math.min(item.dimensions?.depth || 100, 150),
      height: item.dimensions?.height || 80
    };
    setPlacedFurniture((prev) => [...prev, placed]);
    setActiveTab('2D Planner');
  };

  const handleUpdateFurniture = (updatedList) => {
    setPlacedFurniture(updatedList);
  };

  const handleRemoveFurniture = (id) => {
    setPlacedFurniture((prev) => prev.filter((f) => f._id !== id));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-950">
        <div className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-950 text-stone-400">
        <div className="text-center">
          <p className="text-lg mb-4">{error || 'Room not found'}</p>
          <button onClick={() => navigate('/dashboard')} className="text-amber-400 hover:text-amber-300">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 pt-16 flex flex-col">
      {/* Studio Header */}
      <div className="border-b border-stone-800 bg-stone-900/50 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-stone-500 hover:text-stone-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="font-display text-stone-100 text-lg leading-none">{room.name}</h1>
              <p className="text-stone-500 text-xs mt-0.5">
                {room.dimensions?.width}m × {room.dimensions?.length}m × {room.dimensions?.height}m
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {saveMsg && (
              <span className={`text-xs ${saveMsg === 'Saved!' ? 'text-green-400' : 'text-red-400'}`}>
                {saveMsg}
              </span>
            )}
            <span className="text-xs text-stone-500">{placedFurniture.length} items placed</span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-stone-950 text-xs font-medium rounded transition-colors"
            >
              {saving ? 'Saving...' : 'Save Design'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-800 bg-stone-900/30 px-4">
        <div className="max-w-7xl mx-auto flex">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-3 text-sm transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? 'text-amber-400 border-amber-400'
                  : 'text-stone-500 border-transparent hover:text-stone-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === '2D Planner' && (
          <RoomPlanner2D
            room={room}
            placedFurniture={placedFurniture}
            onUpdateFurniture={handleUpdateFurniture}
            onRemoveFurniture={handleRemoveFurniture}
          />
        )}
        {activeTab === '3D View' && (
          <RoomViewer3D room={room} placedFurniture={placedFurniture} />
        )}
        {activeTab === 'Furniture' && (
          <FurnitureCatalog furniture={furniture} onAdd={handleAddFurniture} />
        )}
        {activeTab === 'Budget' && (
          <BudgetCalculator placedFurniture={placedFurniture} onRemove={handleRemoveFurniture} />
        )}
      </div>
    </div>
  );
}
