import { useState } from 'react'
import { uploadScan } from '../api.js'

export default function Upload() {
  const [form, setForm] = useState({ patientName:'', patientId:'', scanType:'RGB', region:'Frontal' });
  const [file, setFile] = useState(null);
  const [msg, setMsg] = useState('');
  const token = localStorage.getItem('token');

  const submit = async (e) => {
    e.preventDefault();
    setMsg('');
    const fd = new FormData();
    fd.append('patientName', form.patientName);
    fd.append('patientId', form.patientId);
    fd.append('scanType', form.scanType);
    fd.append('region', form.region);
    if (file) fd.append('image', file);
    try {
      const res = await uploadScan(fd, token);
      setMsg('Uploaded! Scan ID: ' + res.id);
      setForm({ patientName:'', patientId:'', scanType:'RGB', region:'Frontal' });
      setFile(null);
    } catch (e) {
      setMsg('Error: ' + e.message);
    }
  }

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <h2>Upload Scan</h2>
      {msg && <div>{msg}</div>}
      <input placeholder="Patient Name" value={form.patientName} onChange={set('patientName')} required />
      <input placeholder="Patient ID" value={form.patientId} onChange={set('patientId')} required />
      <label>Scan Type</label>
      <select value={form.scanType} onChange={set('scanType')}>
        <option>RGB</option>
      </select>
      <label>Region</label>
      <select value={form.region} onChange={set('region')}>
        <option>Frontal</option>
        <option>Upper Arch</option>
        <option>Lower Arch</option>
      </select>
      <input type="file" accept="image/png,image/jpeg" onChange={e=>setFile(e.target.files?.[0])} required />
      <button type="submit">Submit</button>
    </form>
  )
}
