import React, { useState } from 'react';

const CATEGORIES = ['all', 'sofa', 'chair', 'table', 'bed', 'decor', 'storage', 'lighting'];

const CATEGORY_ICONS = {
  sofa: '🛋',
  chair: '🪑',
  table: '🪞',
  bed: '🛏',
  decor: '🪴',
  storage: '🗄',
  lighting: '💡',
  all: '⊞'
};

export default function FurnitureCatalog({ furniture, onAdd }) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedColors, setSelectedColors] = useState({});
  const [addedId, setAddedId] = useState(null);

  const filtered = furniture.filter((item) => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = !search || item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleAdd = (item) => {
    const color = selectedColors[item._id] || item.colorOptions?.[0];
    onAdd(item, color);
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 1500);
  };

  return (
    <div className="flex flex-col h-full bg-stone-950">
      {/* Filters */}
      <div className="p-4 bg-stone-900 border-b border-stone-800 space-y-3">
        <input
          type="text"
          placeholder="Search furniture..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2.5 bg-stone-950 border border-stone-700 focus:border-amber-500 rounded text-stone-100 placeholder-stone-600 text-sm outline-none transition-colors"
        />
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded text-xs transition-colors ${
                activeCategory === cat
                  ? 'bg-amber-500 text-stone-950 font-medium'
                  : 'bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-300'
              }`}
            >
              <span>{CATEGORY_ICONS[cat]}</span>
              <span className="capitalize">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Item Count */}
      <div className="px-4 py-2 text-xs text-stone-600 border-b border-stone-900">
        {filtered.length} item{filtered.length !== 1 ? 's' : ''} found
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-stone-600 text-sm">No furniture found</div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filtered.map((item) => (
              <div
                key={item._id}
                className="bg-stone-900 border border-stone-800 rounded-lg overflow-hidden hover:border-stone-700 transition-colors group"
              >
                {/* Preview */}
                <div className="h-24 bg-stone-950 flex items-center justify-center relative">
                  <div
                    className="rounded-sm transition-transform group-hover:scale-105"
                    style={{
                      width: `${Math.min(60, (item.dimensions?.width || 80) * 0.35)}px`,
                      height: `${Math.min(50, (item.dimensions?.depth || 60) * 0.35)}px`,
                      backgroundColor: selectedColors[item._id]
                        ? colorToHex(selectedColors[item._id])
                        : '#57534e',
                      opacity: 0.8
                    }}
                  />
                  <span className="absolute top-2 right-2 text-xs px-1.5 py-0.5 bg-stone-800 text-stone-400 rounded capitalize">
                    {item.category}
                  </span>
                </div>

                <div className="p-3">
                  <h3 className="text-stone-200 text-xs font-medium leading-tight mb-1 truncate" title={item.name}>
                    {item.name}
                  </h3>
                  <p className="text-amber-500 text-xs mb-2">${item.price?.toLocaleString()}</p>

                  {/* Dimensions */}
                  <p className="text-stone-600 text-xs mb-2">
                    {item.dimensions?.width}×{item.dimensions?.depth}×{item.dimensions?.height}cm
                  </p>

                  {/* Color picker */}
                  {item.colorOptions?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {item.colorOptions.slice(0, 6).map((color) => (
                        <button
                          key={color}
                          title={color}
                          onClick={() => setSelectedColors({ ...selectedColors, [item._id]: color })}
                          className={`w-4 h-4 rounded-full border transition-all ${
                            selectedColors[item._id] === color || (!selectedColors[item._id] && item.colorOptions[0] === color)
                              ? 'border-amber-400 scale-110'
                              : 'border-stone-600 hover:border-stone-400'
                          }`}
                          style={{ backgroundColor: colorToHex(color) }}
                        />
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleAdd(item)}
                    className={`w-full py-1.5 text-xs rounded transition-colors font-medium ${
                      addedId === item._id
                        ? 'bg-green-600/20 text-green-400 border border-green-700'
                        : 'bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-stone-950 border border-amber-700/30 hover:border-amber-500'
                    }`}
                  >
                    {addedId === item._id ? '✓ Added!' : '+ Add to Room'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function colorToHex(colorName) {
  const map = {
    'Charcoal Gray': '#374151', 'Beige': '#d4b896', 'Navy Blue': '#1e3a5f',
    'Forest Green': '#2d5a3d', 'Light Gray': '#9ca3af', 'Dark Brown': '#4a2c1a',
    'Cream': '#f5f0e8', 'Slate Blue': '#3d5a7a', 'Rose Pink': '#e8a0a8',
    'Dusty Blue': '#7ba3bd', 'Olive Green': '#6b7c47', 'Ivory': '#f5f0dd',
    'Mustard Yellow': '#d4a017', 'Emerald Green': '#1e7a4a', 'Rust Orange': '#c0522a',
    'Teal': '#2a7a6e', 'Black': '#1a1a1a', 'White': '#f5f5f0', 'Gray': '#6b7280',
    'Natural Oak': '#c8a96e', 'Walnut': '#5d3a1a', 'Dark Walnut': '#3a2010',
    'Light Oak': '#d4b87a', 'Upholstered Gray': '#6b7280', 'Caramel': '#c07840',
    'Natural Wood': '#c4a068', 'Natural Pine': '#d4bc7a', 'Black Marble': '#1a1a2e',
    'Marble White': '#f0ede8', 'Teak Wood': '#8b6040', 'Brass Gold': '#c8a840',
    'Matte Black': '#1a1a1a', 'Gold': '#c8a840', 'Chrome': '#a8b8c0', 'Brass': '#b8960c',
    'Copper': '#b87333', 'Persian Red': '#8b1a1a', 'Nordic Gray': '#7a7a7a',
    'Navy': '#1e3050', 'Sage Green': '#7a9a6e', 'Anthracite': '#3a3a3a'
  };
  for (const [key, val] of Object.entries(map)) {
    if (colorName.toLowerCase().includes(key.toLowerCase().split(' ')[0])) return val;
  }
  return '#57534e';
}
