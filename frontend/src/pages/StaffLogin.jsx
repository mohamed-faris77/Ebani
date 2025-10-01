import React, { useState } from 'react';
import { theme } from '../theme';
import Card from '../components/Card';

export default function StaffLogin({ onLogin }) {
  const [role, setRole] = useState('doctor');
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'doctor' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password, role })
      });
      const data = await res.json();
      if (data.success && data.user.role === role) {
        onLogin(data.user, data.token);
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch {
      setError('Server error');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: form.username, password: form.password, role })
      });
      const data = await res.json();
      if (data.success) {
        setIsRegister(false);
        setError('Registration successful! You can now login.');
      } else {
        setError(data.message);
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
          <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Staff Login</h2>
          <div style={{ marginBottom: theme.spacing.sm }}>
            <label style={{ marginRight: theme.spacing.sm }}>Role:</label>
            <select
              value={role}
              onChange={e => {
                setRole(e.target.value);
                setForm({ ...form, role: e.target.value });
              }}
              style={{ padding: theme.spacing.xs, borderRadius: theme.borderRadius }}
            >
              <option value="doctor">Doctor</option>
              <option value="lab">Lab</option>
              <option value="reception">Reception</option>
            </select>
          </div>
          {!isRegister ? (
            <form
              onSubmit={handleLogin}
              style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}
            >
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                style={{ padding: theme.spacing.xs, borderRadius: theme.borderRadius, border: '1px solid #ccc' }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ padding: theme.spacing.xs, borderRadius: theme.borderRadius, border: '1px solid #ccc' }}
              />
              <button
                type="submit"
                style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.sm, cursor: 'pointer' }}
              >
                Login
              </button>
            </form>
          ) : (
            <form
              onSubmit={handleRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: theme.spacing.sm }}
            >
              <input
                name="username"
                type="text"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
                required
                style={{ padding: theme.spacing.xs, borderRadius: theme.borderRadius, border: '1px solid #ccc' }}
              />
              <input
                name="password"
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{ padding: theme.spacing.xs, borderRadius: theme.borderRadius, border: '1px solid #ccc' }}
              />
              <button
                type="submit"
                style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.sm, cursor: 'pointer' }}
              >
                Register
              </button>
            </form>
          )}
          <button
            onClick={() => setIsRegister(!isRegister)}
            style={{ marginTop: theme.spacing.sm, background: theme.colors.secondary, color: '#fff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs, cursor: 'pointer' }}
          >
            {isRegister ? 'Back to Login' : 'Register'}
          </button>
          {error && (
            <p style={{ color: theme.colors.error, marginTop: theme.spacing.sm, textAlign: 'center' }}>{error}</p>
          )}
        </Card>
      </div>
    </div>
  );
}
