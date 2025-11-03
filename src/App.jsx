import React, { useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import CashflowInput from './components/CashflowInput';
import CashflowList from './components/CashflowList';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '') || '';

async function apiLogin(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: email, password }),
  });
  if (!res.ok) throw new Error('Invalid email or password');
  return res.json();
}

async function apiRegister(email, password) {
  const res = await fetch(`${BACKEND_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw new Error('Failed to register');
  return res.json();
}

async function apiMe(token) {
  const res = await fetch(`${BACKEND_URL}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Not authenticated');
  return res.json();
}

async function apiList(token) {
  const res = await fetch(`${BACKEND_URL}/cashflows?limit=100`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch');
  return res.json();
}

async function apiAdd(token, amount, reason) {
  const res = await fetch(`${BACKEND_URL}/cashflows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ amount, reason }),
  });
  if (!res.ok) throw new Error('Failed to add');
  return res.json();
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      if (!token) return;
      try {
        const me = await apiMe(token);
        setUser(me);
        const list = await apiList(token);
        setItems(list);
      } catch (e) {
        console.error(e);
        setToken('');
        localStorage.removeItem('token');
      }
    };
    init();
  }, [token]);

  useEffect(() => {
    if (!user || !token || !BACKEND_URL) return;
    const wsUrl = BACKEND_URL.replace(/^http/, 'ws') + `/ws/cashflows?token=${token}`;
    const ws = new WebSocket(wsUrl);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setItems((prev) => [data, ...prev]);
      } catch {}
    };

    ws.onerror = () => {};
    // Send pings to keep alive (and to satisfy server loop)
    const interval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.send('ping');
    }, 25000);

    return () => {
      clearInterval(interval);
      ws.close();
    };
  }, [user, token]);

  const handleLogin = async (email, password) => {
    const res = await apiLogin(email, password);
    setToken(res.access_token);
    localStorage.setItem('token', res.access_token);
  };

  const handleRegister = async (email, password) => {
    const res = await apiRegister(email, password);
    setToken(res.access_token);
    localStorage.setItem('token', res.access_token);
  };

  const handleLogout = () => {
    setToken('');
    setUser(null);
    setItems([]);
    localStorage.removeItem('token');
  };

  const handleAdd = async (amount, reason) => {
    const created = await apiAdd(token, amount, reason);
    // We also optimistically add to the list to feel snappy; WS will also push
    setItems((prev) => [{ ...created, created_at: created.created_at }, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      <Header user={user} onLogout={handleLogout} />

      <main className="max-w-5xl mx-auto px-4 py-10">
        {!user ? (
          <div className="flex flex-col items-center">
            <h1 className="text-3xl font-semibold text-gray-900 mb-6 text-center">
              Track your cashflow in real time
            </h1>
            <LoginForm onLogin={handleLogin} onRegister={handleRegister} />
          </div>
        ) : (
          <div className="space-y-6">
            <CashflowInput onAdd={handleAdd} />
            <CashflowList items={items} />
          </div>
        )}
      </main>
    </div>
  );
}
