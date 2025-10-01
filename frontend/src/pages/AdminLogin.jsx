import React, { useState } from 'react';
import { theme } from '../theme';
import Card from '../components/Card';


const API = 'http://localhost:5000/api';

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'admin', password })
      });
      const data = await res.json();
      if (data.success && data.user.role === 'admin') {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100vw',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Card style={{ maxWidth: 400, width: '100%', margin: '0 auto' }}>
          <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Admin Login</h2>
          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}
          >
            <input
              type="password"
              placeholder="Admin Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                padding: theme.spacing.xs,
                borderRadius: theme.borderRadius,
                border: '1px solid #ccc',
              }}
            />
            <button
              type="submit"
              style={{
                background: theme.colors.primary,
                color: '#fff',
                border: 'none',
                borderRadius: theme.borderRadius,
                padding: theme.spacing.sm,
                cursor: 'pointer',
              }}
            >
              Login
            </button>
          </form>
          {error && (
            <p style={{ color: theme.colors.error, marginTop: theme.spacing.sm, textAlign: 'center' }}>
              {error}
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}
