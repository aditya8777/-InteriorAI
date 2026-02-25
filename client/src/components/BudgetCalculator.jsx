import React, { useMemo, useState } from 'react';

const TAX_RATE = 0.08; // 8% tax

export default function BudgetCalculator({ placedFurniture, onRemove }) {
  const [budgetLimit, setBudgetLimit] = useState(10000);

  const subtotal = useMemo(
    () => placedFurniture.reduce((sum, f) => sum + (f.price || 0), 0),
    [placedFurniture]
  );
  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;
  const overBudget = total > budgetLimit;

  const byCategory = useMemo(() => {
    const groups = {};
    placedFurniture.forEach((f) => {
      if (!groups[f.category]) groups[f.category] = [];
      groups[f.category].push(f);
    });
    return groups;
  }, [placedFurniture]);

  const categoryTotals = Object.entries(byCategory).map(([cat, items]) => ({
    category: cat,
    count: items.length,
    total: items.reduce((sum, f) => sum + (f.price || 0), 0),
    items
  })).sort((a, b) => b.total - a.total);

  return (
    <div className="flex flex-col h-full bg-stone-950">
      <div className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="max-w-3xl mx-auto p-6 space-y-6">
          {/* Budget Limit */}
          <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-display text-lg text-stone-100">Budget Planner</h2>
              <span className={`text-sm font-medium ${overBudget ? 'text-red-400' : 'text-green-400'}`}>
                {overBudget ? `$${(total - budgetLimit).toLocaleString()} over budget` : `$${(budgetLimit - total).toLocaleString()} under budget`}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <label className="text-stone-400 text-xs uppercase tracking-wider whitespace-nowrap">
                Budget Limit:
              </label>
              <input
                type="range"
                min="500"
                max="100000"
                step="500"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                className="flex-1 accent-amber-500"
              />
              <span className="text-amber-400 text-sm font-medium whitespace-nowrap">
                ${budgetLimit.toLocaleString()}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-xs text-stone-500 mb-1.5">
                <span>Spent: ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                <span>Limit: ${budgetLimit.toLocaleString()}</span>
              </div>
              <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-amber-500'}`}
                  style={{ width: `${Math.min((total / budgetLimit) * 100, 100)}%` }}
                />
              </div>
              <p className="text-right text-xs text-stone-600 mt-1">
                {Math.round((total / budgetLimit) * 100)}% used
              </p>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Subtotal', value: `$${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: `${placedFurniture.length} items` },
              { label: `Tax (${(TAX_RATE * 100).toFixed(0)}%)`, value: `$${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: 'Sales tax' },
              { label: 'Total', value: `$${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}`, sub: overBudget ? '⚠ Over limit' : '✓ Within budget', highlight: true }
            ].map((s) => (
              <div key={s.label} className={`p-4 rounded-lg border ${s.highlight ? 'bg-amber-500/5 border-amber-700/30' : 'bg-stone-900 border-stone-800'}`}>
                <p className="text-stone-500 text-xs uppercase tracking-wider mb-1">{s.label}</p>
                <p className={`font-display text-xl ${s.highlight ? 'text-amber-400' : 'text-stone-100'}`}>{s.value}</p>
                <p className={`text-xs mt-0.5 ${overBudget && s.highlight ? 'text-red-400' : 'text-stone-600'}`}>{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Category Breakdown */}
          {categoryTotals.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
              <h3 className="font-display text-base text-stone-100 mb-4">By Category</h3>
              <div className="space-y-3">
                {categoryTotals.map(({ category, count, total: catTotal }) => (
                  <div key={category}>
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <span className="capitalize text-stone-300 text-sm">{category}</span>
                        <span className="text-stone-600 text-xs">({count} item{count !== 1 ? 's' : ''})</span>
                      </div>
                      <span className="text-stone-400 text-sm">${catTotal.toLocaleString()}</span>
                    </div>
                    <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-amber-600/60 rounded-full"
                        style={{ width: `${subtotal ? (catTotal / subtotal) * 100 : 0}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Item-wise Breakdown */}
          {placedFurniture.length > 0 && (
            <div className="bg-stone-900 border border-stone-800 rounded-lg p-5">
              <h3 className="font-display text-base text-stone-100 mb-4">Item Breakdown</h3>
              <div className="space-y-2">
                {placedFurniture.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="flex-shrink-0">
                        <span className="capitalize text-xs text-stone-600 bg-stone-800 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-stone-300 text-sm truncate">{item.name}</p>
                        {item.color && (
                          <p className="text-stone-600 text-xs">{item.color}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-amber-500 text-sm">${(item.price || 0).toLocaleString()}</span>
                      <button
                        onClick={() => onRemove(item._id)}
                        className="text-stone-700 hover:text-red-400 transition-colors"
                        title="Remove item"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals Row */}
              <div className="mt-4 pt-4 border-t border-stone-700 space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Subtotal</span>
                  <span className="text-stone-300">${subtotal.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500">Tax ({(TAX_RATE * 100).toFixed(0)}%)</span>
                  <span className="text-stone-300">${tax.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-stone-800">
                  <span className="text-stone-200">Total</span>
                  <span className={overBudget ? 'text-red-400' : 'text-amber-400'}>
                    ${total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              </div>
            </div>
          )}

          {placedFurniture.length === 0 && (
            <div className="text-center py-12 bg-stone-900 border border-stone-800 rounded-lg">
              <p className="text-stone-500 text-sm">No furniture added yet.</p>
              <p className="text-stone-700 text-xs mt-1">Switch to the Furniture tab to browse and add items.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
