import { useState } from 'react'
import { login } from '../api.js'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await login(email, password);
      localStorage.setItem('token', res.token);
      localStorage.setItem('role', res.role);
      navigate(res.role === 'TECHNICIAN' ? '/upload' : '/viewer');
    } catch (e) {
      setErr(e.message);
    }
  }
  return (
    <form onSubmit={submit} style={{ display: 'grid', gap: 8 }}>
      <h2>Login</h2>
      {err && <div style={{ color: 'red' }}>{err}</div>}
      <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
      <button type="submit">Login</button>
      <div style={{ fontSize: 12, color: '#555' }}>
        Demo users:<br/>
        technician@example.com / password<br/>
        dentist@example.com / password
      </div>
    </form>
  )
}
