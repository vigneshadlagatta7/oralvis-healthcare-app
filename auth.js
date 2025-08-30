import express from 'express';
import bcrypt from 'bcryptjs';
import db from '../setup-db.js';
import { signToken } from '../auth-mw.js';

const router = express.Router();

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    const ok = bcrypt.compareSync(password, user.password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
    const token = signToken({ id: user.id, email: user.email, role: user.role });
    res.json({ token, role: user.role, email: user.email });
  });
});

export default router;
