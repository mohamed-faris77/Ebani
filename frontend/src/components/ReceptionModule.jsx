import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import Card from './Card';

const API = `${import.meta.env.VITE_API_URL}/api`;



export default function ReceptionModule({ token }) {
  const [tab, setTab] = useState('patients');
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '' });
  const [newAppointment, setNewAppointment] = useState({ patientName: '', date: '' });

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    const res = await fetch(`${API}/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPatients(await res.json());
  };

  const fetchAppointments = async () => {
    const res = await fetch(`${API}/appointments`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setAppointments(await res.json());
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    await fetch(`${API}/patients`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(newPatient)
    });
    setNewPatient({ name: '', age: '' });
    fetchPatients();
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!newAppointment.patientName || !newAppointment.date) return;
    try {
      const res = await fetch(`${API}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          patientName: newAppointment.patientName,
          date: newAppointment.date
        })
      });
      if (!res.ok) {
        const err = await res.json();
        alert('Error: ' + (err.message || 'Failed to add appointment'));
      } else {
        setNewAppointment({ patientName: '', date: '' });
        fetchAppointments();
      }
    } catch (error) {
      alert('Network error');
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
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          maxWidth: 800,
          padding: theme.spacing.md,
        }}
      >
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Reception Panel</h2>
        <div style={{ display: 'flex', gap: 16, marginBottom: 24, justifyContent: 'center' }}>
          <button onClick={() => setTab('patients')} style={{ background: tab === 'patients' ? theme.colors.primary : '#e5e7eb', color: tab === 'patients' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Patients</button>
          <button onClick={() => setTab('appointments')} style={{ background: tab === 'appointments' ? theme.colors.primary : '#e5e7eb', color: tab === 'appointments' ? '#fff' : '#222', border: 'none', borderRadius: 4, padding: '8px 16px' }}>Schedule Appointments</button>
        </div>
        <Card style={{ width: '100%', margin: '0 auto' }}>
          {tab === 'patients' && (
            <>
              <h3 style={{ color: theme.colors.primary, textAlign: 'center' }}>Add Patient</h3>
              <form onSubmit={handleAddPatient} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <input type="text" placeholder="Patient Name" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                <input type="number" placeholder="Age" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                <button type="submit" style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Add Patient</button>
              </form>
              <ul style={{ marginBottom: 0, paddingLeft: 0, listStyle: 'none', textAlign: 'center' }}>
                {patients.length === 0 ? (
                  <li style={{ color: '#888' }}>No patients yet.</li>
                ) : (
                  patients.map(p => (
                    <li key={p._id} style={{ color: '#333', marginBottom: 6 }}>{p.name} (Age: {p.age})</li>
                  ))
                )}
              </ul>
            </>
          )}
          {tab === 'appointments' && (
            <>
              <h3 style={{ color: theme.colors.primary, textAlign: 'center' }}>Schedule Appointments</h3>
              <form onSubmit={handleAddAppointment} style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center', marginBottom: 16 }}>
                <select value={newAppointment.patientName} onChange={e => setNewAppointment({ ...newAppointment, patientName: e.target.value })} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }}>
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p._id} value={p.name}>{p.name} (Age: {p.age})</option>
                  ))}
                </select>
                <input type="text" placeholder="Date" value={newAppointment.date} onChange={e => setNewAppointment({ ...newAppointment, date: e.target.value })} required style={{ padding: 8, borderRadius: 6, border: '1px solid #ccc', width: '100%' }} />
                <button type="submit" style={{ background: theme.colors.success, color: '#fff', border: 'none', borderRadius: 6, padding: '8px 20px', fontWeight: 600, cursor: 'pointer', marginTop: 8 }}>Schedule Appointment</button>
              </form>
              <ul style={{ marginBottom: 0, paddingLeft: 0, listStyle: 'none', textAlign: 'center' }}>
                {appointments.length === 0 ? (
                  <li style={{ color: '#888' }}>No appointments yet.</li>
                ) : (
                  appointments.map(a => (
                    <li key={a._id} style={{ color: '#333', marginBottom: 6 }}>Patient: {a.patientName}, Date: {a.date}</li>
                  ))
                )}
              </ul>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
