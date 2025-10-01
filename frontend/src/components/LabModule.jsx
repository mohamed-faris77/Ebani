import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import Card from './Card';

const API = `${import.meta.env.VITE_API_URL}/api`;



export default function LabModule({ token }) {
  const [labReports, setLabReports] = useState([]);
  const [patients, setPatients] = useState([]);
  const [newLabReport, setNewLabReport] = useState({ patientName: '', result: '' });

  useEffect(() => {
    fetchLabReports();
    fetchPatients();
  }, []);

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
  const handleAddLabReport = async (e) => {
    e.preventDefault();
    if (!newLabReport.patientName || !newLabReport.result) {
      alert('Please select a patient and enter a result.');
      return;
    }
    await fetch(`${API}/labreports`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newLabReport)
    });
    setNewLabReport({ patientName: '', result: '' });
    fetchLabReports();
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
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Lab Panel</h2>
        <Card style={{ width: '100%', margin: '0 auto' }}>
          <h3 style={{ color: theme.colors.primary, textAlign: 'center' }}>Add Lab Report</h3>
          <form onSubmit={handleAddLabReport} style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <select value={newLabReport.patientName} onChange={e => setNewLabReport({ ...newLabReport, patientName: e.target.value })} required style={{ marginRight: 8 }}>
              <option value="">Select Patient</option>
              {patients.map(p => (
                <option key={p._id} value={p.name}>{p.name} (Age: {p.age})</option>
              ))}
            </select>
            <input type="text" placeholder="Result" value={newLabReport.result} onChange={e => setNewLabReport({ ...newLabReport, result: e.target.value })} required style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Add Lab Report</button>
          </form>
          <ul>
            {labReports.map(r => (
              <li key={r._id} style={{ color: '#333' }}>Patient: {r.patientName}, Result: {r.result}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
