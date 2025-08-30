import { useEffect, useState } from 'react'
import { listScans, reportUrl } from '../api.js'

export default function Viewer() {
  const token = localStorage.getItem('token');
  const [items, setItems] = useState([]);
  const [err, setErr] = useState('');
  useEffect(() => {
    (async () => {
      try {
        const rows = await listScans(token);
        setItems(rows);
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, []);
  if (err) return <div style={{ color:'red' }}>{err}</div>
  return (
    <div>
      <h2>Stored Scans</h2>
      <div style={{ display:'grid', gap:12 }}>
        {items.map(it => (
          <div key={it.id} style={{ border:'1px solid #ddd', padding:12, borderRadius:8 }}>
            <div><strong>{it.patientName}</strong> (ID: {it.patientId})</div>
            <div>{it.scanType} • {it.region}</div>
            <div>Uploaded: {new Date(it.createdAt).toLocaleString()}</div>
            <div style={{ marginTop:8 }}>
              <img src={it.imageUrl.startsWith('http') ? it.imageUrl : (it.imageUrl)} alt="thumb" style={{ maxWidth: 300, maxHeight: 180, objectFit:'contain' }} />
            </div>
            <div style={{ marginTop:8 }}>
              <a href={reportUrl(it.id)} target="_blank" rel="noreferrer">Download PDF Report</a>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
