import express from 'express';
import db from '../setup-db.js';
import { authRequired, requireRole } from '../auth-mw.js';
import { upload, useCloudinary } from '../storage.js';
import { buildScanPdf } from '../pdf.js';

const router = express.Router();

// Technician: upload scan
router.post('/', authRequired, requireRole('TECHNICIAN'), upload.single('image'), (req, res) => {
  const { patientName, patientId, scanType, region } = req.body;
  if (!patientName || !patientId || !scanType || !region || !req.file) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  // file location depends on storage
  const imageUrl = req.file.path || (req.file.secure_url || req.file.url);
  const createdAt = new Date().toISOString();
  db.run(
    `INSERT INTO scans (patientName, patientId, scanType, region, imageUrl, createdAt)
     VALUES (?,?,?,?,?,?)`,
    [patientName, patientId, scanType, region, imageUrl, createdAt],
    function (err) {
      if (err) return res.status(500).json({ error: 'DB insert error' });
      res.json({ id: this.lastID, patientName, patientId, scanType, region, imageUrl, createdAt });
    }
  );
});

// Dentist: list scans
router.get('/', authRequired, requireRole('DENTIST'), (req, res) => {
  db.all('SELECT * FROM scans ORDER BY datetime(createdAt) DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB query error' });
    res.json(rows);
  });
});

// Dentist: get single scan
router.get('/:id', authRequired, requireRole('DENTIST'), (req, res) => {
  db.get('SELECT * FROM scans WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'DB query error' });
    if (!row) return res.status(404).json({ error: 'Not found' });
    res.json(row);
  });
});

// Dentist: PDF report
router.get('/:id/report.pdf', authRequired, requireRole('DENTIST'), async (req, res) => {
  db.get('SELECT * FROM scans WHERE id = ?', [req.params.id], async (err, row) => {
    if (err) return res.status(500).json({ error: 'DB query error' });
    if (!row) return res.status(404).json({ error: 'Not found' });
    try {
      const pdfBuffer = await buildScanPdf(row);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=scan-${row.id}.pdf`);
      res.send(pdfBuffer);
    } catch (e) {
      res.status(500).json({ error: 'Failed to build PDF' });
    }
  });
});

export default router;
