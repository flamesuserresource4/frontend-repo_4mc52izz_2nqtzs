import React from 'react';
import { DollarSign, LogOut, User } from 'lucide-react';

export default function Header({ user, onLogout }) {
  return (
    <header className="w-full border-b border-gray-200 bg-white/70 backdrop-blur sticky top-0 z-20">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-900">
          <DollarSign className="w-6 h-6 text-emerald-600" />
          <span className="font-semibold text-lg">Cashflow</span>
        </div>
        {user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <User className="w-4 h-4" />
              <span>{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-900 text-white text-sm hover:bg-gray-800"
            >
              <LogOut className="w-4 h-4" /> Logout
            </button>
          </div>
        ) : (
          <div className="text-sm text-gray-500">Secure personal cashflow tracker</div>
        )}
      </div>
    </header>
  );
}
