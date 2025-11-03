import React, { useState } from 'react';
import { Lock, Mail } from 'lucide-react';

export default function LoginForm({ onLogin, onRegister }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister(email, password);
      }
    } catch (err) {
      setError(err?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-1">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        {mode === 'login' ? 'Sign in to continue' : 'Sign up to get started'}
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
          />
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full pl-9 pr-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            required
            minLength={6}
          />
        </div>
        {error && <div className="text-sm text-red-600">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center px-4 py-2 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </form>
      <div className="text-sm text-gray-500 mt-4 text-center">
        {mode === 'login' ? (
          <button className="text-emerald-700 hover:underline" onClick={() => setMode('register')}>
            Need an account? Sign up
          </button>
        ) : (
          <button className="text-emerald-700 hover:underline" onClick={() => setMode('login')}>
            Already have an account? Sign in
          </button>
        )}
      </div>
    </div>
  );
}
