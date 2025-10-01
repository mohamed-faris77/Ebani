import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import Card from './Card';

const API = `${import.meta.env.VITE_API_URL}/api`;
const PAGE_SIZE = 5;

export default function AdminModule({ token }) {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ username: '', role: '' });
  const [appointments, setAppointments] = useState([]);
  const [labReports, setLabReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    if (tab === 'users') fetchUsers();
    if (tab === 'appointments') fetchAppointments();
    if (tab === 'labreports') fetchLabReports();
    if (tab === 'reception') fetchPatients();
  }, [tab, page, refresh]);

  const fetchUsers = async () => {
    const res = await fetch(`${API}/users?page=${page}&limit=${PAGE_SIZE}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.status === 401) {
      setUsers([]);
      setTotalPages(1);
      return;
    }
    const data = await res.json();
    setUsers(data.users);
    setTotalPages(data.totalPages);
  };
  const fetchAppointments = async () => {
    const res = await fetch(`${API}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(await res.json());
  };
  const fetchLabReports = async () => {
    const res = await fetch(`${API}/labreports`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setLabReports(await res.json());
  };
  const fetchPatients = async () => {
    const res = await fetch(`${API}/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPatients(await res.json());
  };

  const handleEdit = (user) => {
    setEditId(user._id);
    setEditData({ username: user.username, role: user.role });
  };
  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };
  const handleEditSave = async (id) => {
    await fetch(`${API}/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editData)
    });
    setEditId(null);
    setRefresh(r => !r);
  };
  const handleRemove = async (id) => {
    await fetch(`${API}/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    setRefresh(r => !r);
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 800,
          padding: theme.spacing.md,
        }}
      >
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Admin Panel</h2>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
          <button onClick={() => setTab('users')} style={{ background: tab === 'users' ? theme.colors.primary : '#e5e7eb', color: tab === 'users' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Users</button>
          <button onClick={() => setTab('appointments')} style={{ background: tab === 'appointments' ? theme.colors.primary : '#e5e7eb', color: tab === 'appointments' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Appointments</button>
          <button onClick={() => setTab('labreports')} style={{ background: tab === 'labreports' ? theme.colors.primary : '#e5e7eb', color: tab === 'labreports' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Lab Reports</button>
          <button onClick={() => setTab('reception')} style={{ background: tab === 'reception' ? theme.colors.primary : '#e5e7eb', color: tab === 'reception' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Reception Reports</button>
        </div>
        <Card style={{ width: '100%', margin: '0 auto' }}>
          {tab === 'users' && (
            <>
              {users.length === 0 ? (
                <div style={{ color: theme.colors.text, textAlign: 'center', padding: theme.spacing.md }}>
                  No staff found. Add staff to see them here.
                </div>
              ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff', color: theme.colors.text, border: '1px solid #e5e7eb' }}>
                  <thead>
                    <tr style={{ background: theme.colors.background }}>
                      <th style={{ padding: theme.spacing.xs, borderBottom: '1px solid #e5e7eb' }}>Username</th>
                      <th style={{ padding: theme.spacing.xs, borderBottom: '1px solid #e5e7eb' }}>Role</th>
                      <th style={{ padding: theme.spacing.xs, borderBottom: '1px solid #e5e7eb' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                        <td style={{ padding: theme.spacing.xs }}>
                          {editId === u._id ? (
                            <input name="username" value={editData.username} onChange={handleEditChange} />
                          ) : u.username}
                        </td>
                        <td style={{ padding: theme.spacing.xs }}>
                          {editId === u._id ? (
                            <select name="role" value={editData.role} onChange={handleEditChange}>
                              <option value="doctor">Doctor</option>
                              <option value="lab">Lab</option>
                              <option value="reception">Reception</option>
                            </select>
                          ) : u.role}
                        </td>
                        <td style={{ padding: theme.spacing.xs }}>
                          {editId === u._id ? (
                            <>
                              <button onClick={() => handleEditSave(u._id)} style={{ background: theme.colors.success, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs, marginRight: theme.spacing.xs }}>Save</button>
                              <button onClick={() => setEditId(null)} style={{ background: theme.colors.error, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs }}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleEdit(u)} style={{ background: theme.colors.primary, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs, marginRight: theme.spacing.xs }}>Edit</button>
                              <button onClick={() => handleRemove(u._id)} style={{ background: theme.colors.error, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs }}>Remove</button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div style={{ marginTop: theme.spacing.md, display: 'flex', justifyContent: 'center', gap: theme.spacing.sm }}>
                <button disabled={page === 1} onClick={() => setPage(page - 1)} style={{ background: theme.colors.primary, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs }}>Prev</button>
                <span>Page {page} of {totalPages}</span>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} style={{ background: theme.colors.primary, color: '#000000ff', border: 'none', borderRadius: theme.borderRadius, padding: theme.spacing.xs }}>Next</button>
              </div>
            </>
          )}
          {tab === 'appointments' && (
            <>
              <h3 style={{ color: theme.colors.primary }}>Appointments</h3>
              <ul>
                {appointments.map(a => (
                  <li key={a._id} style={{ color: '#333', marginBottom: 8 }}>Patient: {a.patientName}, Date: {a.date}</li>
                ))}
              </ul>
            </>
          )}
          {tab === 'labreports' && (
            <>
              <h3 style={{ color: theme.colors.primary }}>Lab Reports</h3>
              <ul>
                {labReports.map(r => (
                  <li key={r._id} style={{ color: '#333', marginBottom: 8 }}>Patient: {r.patientName}, Result: {r.result}</li>
                ))}
              </ul>
            </>
          )}
          {tab === 'reception' && (
            <>
              <h3 style={{ color: theme.colors.primary }}>Reception Reports</h3>
              <ul>
                {patients.map(p => (
                  <li key={p._id} style={{ color: '#333', marginBottom: 8 }}>{p.name} (Age: {p.age}) {p.concern && <span>- Concern: {p.concern}</span>} {p.notes && <span>- Notes: {p.notes.join(', ')}</span>}</li>
                ))}
              </ul>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
