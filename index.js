import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import scansRouter from './routes/scans.js';
import './setup-db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static('uploads')); // serve local images if used

app.get('/', (req, res) => res.json({ ok: true, service: 'OralVis API' }));
app.use('/api/auth', authRouter);
app.use('/api/scans', scansRouter);

app.listen(PORT, () => {
  console.log(`OralVis server running on http://localhost:${PORT}`);
});
