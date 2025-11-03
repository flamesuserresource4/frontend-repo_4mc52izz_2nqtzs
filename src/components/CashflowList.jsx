import React from 'react';

function Item({ item }) {
  const isPositive = Number(item.amount) >= 0;
  return (
    <div className="flex items-center justify-between py-2">
      <div>
        <div className="font-medium text-gray-900">{item.reason}</div>
        <div className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</div>
      </div>
      <div className={isPositive ? 'text-emerald-600 font-semibold' : 'text-red-600 font-semibold'}>
        {isPositive ? '+' : ''}{Number(item.amount).toFixed(2)}
      </div>
    </div>
  );
}

export default function CashflowList({ items }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        <span className="text-xs text-gray-500">Live</span>
      </div>
      <div className="divide-y">
        {items.length === 0 ? (
          <div className="text-sm text-gray-500 py-6 text-center">No entries yet. Add your first record above.</div>
        ) : (
          items.map((it) => <Item key={it.id} item={it} />)
        )}
      </div>
    </div>
  );
}
