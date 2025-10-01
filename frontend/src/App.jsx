
import { useState } from 'react';
import './App.css';
import { theme } from './theme';
import Card from './components/Card';
import ReceptionModule from './components/ReceptionModule';
import DoctorModule from './components/DoctorModule';
import LabModule from './components/LabModule';
import AdminModule from './components/AdminModule';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';

const API = 'http://localhost:5000/api';


function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [page, setPage] = useState('select');

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setPage('select');
  };



  if (page === 'select') {
    return (
      <div
        style={{
          minHeight: '100vh',
          background: theme.colors.background,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100vw',
        }}
      >
        <Card
          style={{
            maxWidth: 400,
            width: '100%',
            boxSizing: 'border-box',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}
        >
          <h2
            style={{
              color: theme.colors.primary,
              marginBottom: theme.spacing.md,
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 700,
            }}
          >
            Hospital Management System
          </h2>
          <button
            onClick={() => setPage('adminLogin')}
            style={{
              background: theme.colors.primary,
              color: '#fff',
              border: 'none',
              borderRadius: theme.borderRadius,
              padding: theme.spacing.sm,
              marginBottom: theme.spacing.sm,
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'background 0.2s',
            }}
          >
            Admin Login
          </button>
          <button
            onClick={() => setPage('staffLogin')}
            style={{
              background: theme.colors.secondary || '#555',
              color: '#fff',
              border: 'none',
              borderRadius: theme.borderRadius,
              padding: theme.spacing.sm,
              cursor: 'pointer',
              width: '100%',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'background 0.2s',
            }}
          >
            Staff Login
          </button>
        </Card>
     
        <style>{`
          @media (max-width: 500px) {
            .card-landing {
              max-width: 95vw !important;
              padding: 12px !important;
            }
            .card-landing h2 {
              font-size: 1.3rem !important;
            }
            .card-landing button {
              font-size: 0.95rem !important;
              padding: 10px !important;
            }
          }
        `}</style>
      </div>
    );
  }

  if (page === 'adminLogin') {
    return <AdminLogin onLogin={(user, token) => { setUser(user); setToken(token); setPage('admin'); }} />;
  }

  if (page === 'staffLogin') {
    return <StaffLogin onLogin={(user, token) => { setUser(user); setToken(token); setPage(user.role); }} />;
  }

  return (
    <div style={{ minHeight: '100vh', background: theme.colors.background }}>
      <header style={{ background: theme.colors.primary, color: '#fff', padding: theme.spacing.md, borderRadius: theme.borderRadius, margin: theme.spacing.sm, textAlign: 'center' }}>
        <h2 style={{ margin: 0 }}>Hospital Management System</h2>
        <nav style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: theme.spacing.sm, gap: theme.spacing.md }}>
          <span>
            {user ? (<>
              Logged in as: <b>{user.username}</b> ({user.role})
            </>) : 'Admin'}
          </span>
          <button onClick={handleLogout} style={{ background: theme.colors.secondary, color: '#fff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs, cursor: 'pointer' }}>Logout</button>
        </nav>
      </header>
      <main style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '70vh', marginTop: theme.spacing.lg }}>
        {page === 'reception' && <ReceptionModule token={token} />}
        {page === 'doctor' && <DoctorModule token={token} />}
        {page === 'lab' && <LabModule token={token} />}
        {page === 'admin' && <AdminModule token={token} user={user} />}
      </main>
    </div>
  );
}

export default App;
