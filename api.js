const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!res.ok) throw new Error('Login failed');
  return res.json();
}

export async function uploadScan(formData, token) {
  const res = await fetch(`${API_BASE}/api/scans`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData
  });
  if (!res.ok) throw new Error('Upload failed');
  return res.json();
}

export async function listScans(token) {
  const res = await fetch(`${API_BASE}/api/scans`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  if (!res.ok) throw new Error('List failed');
  return res.json();
}

export function reportUrl(id) {
  const base = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
  return `${base}/api/scans/${id}/report.pdf`;
}
