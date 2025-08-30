import { Link, useNavigate } from 'react-router-dom'

export default function Nav() {
  const navigate = useNavigate();
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('token');
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }
  return (
    <nav style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
      <strong>OralVis</strong>
      {role === 'TECHNICIAN' && <Link to="/upload">Upload</Link>}
      {role === 'DENTIST' && <Link to="/viewer">Scans</Link>}
      {!token ? <Link to="/login">Login</Link> : <button onClick={logout}>Logout</button>}
    </nav>
  )
}
