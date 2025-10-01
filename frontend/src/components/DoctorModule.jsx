import React, { useState, useEffect } from 'react';
import { theme } from '../theme';
import Card from './Card';

const API = `${import.meta.env.VITE_API_URL}/api`;



export default function DoctorModule({ token }) {
  const [patients, setPatients] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', concern: '' });

  useEffect(() => {
    fetchPatients();
    fetchAppointments();
  }, []);

  const fetchPatients = async () => {
    const res = await fetch(`${API}/doctor/patients`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setPatients(await res.json());
  };
  const fetchAppointments = async () => {
    const res = await fetch(`${API}/doctor/appointments`, {
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
    setNewPatient({ name: '', age: '', concern: '' });
    fetchPatients();
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
        <h2 style={{ color: theme.colors.primary, textAlign: 'center' }}>Doctor Panel</h2>
        <Card style={{ width: '100%', margin: '0 auto' }}>
          <h3 style={{ color: theme.colors.primary, textAlign: 'center' }}>Add Patient</h3>
          <form onSubmit={handleAddPatient} style={{ marginBottom: 16, display: 'flex', gap: 8, justifyContent: 'center' }}>
            <input type="text" placeholder="Patient Name" value={newPatient.name} onChange={e => setNewPatient({ ...newPatient, name: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="number" placeholder="Age" value={newPatient.age} onChange={e => setNewPatient({ ...newPatient, age: e.target.value })} required style={{ marginRight: 8 }} />
            <input type="text" placeholder="Concern" value={newPatient.concern} onChange={e => setNewPatient({ ...newPatient, concern: e.target.value })} required style={{ marginRight: 8 }} />
            <button type="submit" style={{ background: theme.colors.primary, color: '#fff', border: 'none', borderRadius: 4, padding: '4px 12px' }}>Add Patient</button>
          </form>
          <ul style={{ marginBottom: 16 }}>
            {patients.map(p => (
              <li key={p._id} style={{ color: '#333' }}>{p.name} (Age: {p.age}) {p.concern && <span>- Concern: {p.concern}</span>} {p.notes && <span>- Notes: {p.notes.join(', ')}</span>}</li>
            ))}
          </ul>
          <h3 style={{ color: theme.colors.primary, textAlign: 'center' }}>Appointments</h3>
          <ul>
            {appointments.map(a => (
              <li key={a._id} style={{ color: '#333' }}>Patient: {a.patientName}, Date: {a.date}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
