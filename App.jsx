import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Upload from './pages/Upload.jsx'
import Viewer from './pages/Viewer.jsx'
import Nav from './components/Nav.jsx'

const getUser = () => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  return token ? { token, role } : null;
}

function Protected({ children, role }) {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 16 }}>
      <Nav />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<Protected role="TECHNICIAN"><Upload /></Protected>} />
        <Route path="/viewer" element={<Protected role="DENTIST"><Viewer /></Protected>} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  )
}
