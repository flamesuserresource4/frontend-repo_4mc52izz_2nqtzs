import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';

export default function CashflowInput({ onAdd }) {
  const [amount, setAmount] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !reason) return;
    setLoading(true);
    try {
      await onAdd(parseFloat(amount), reason);
      setAmount('');
      setReason('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount (e.g. -23.50)"
          className="flex-1 px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <input
          type="text"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Spending reason"
          className="flex-[2] px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          <PlusCircle className="w-4 h-4" /> Add
        </button>
      </div>
    </form>
  );
}
