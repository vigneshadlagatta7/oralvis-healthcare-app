import PDFDocument from 'pdfkit';
import axios from 'axios';
import fs from 'fs';

export async function buildScanPdf(scan) {
  const doc = new PDFDocument({ autoFirstPage: true, margin: 50 });
  const chunks = [];
  return await new Promise(async (resolve, reject) => {
    doc.on('data', (c) => chunks.append ? chunks.append(c) : chunks.push(c));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    doc.fontSize(20).text('OralVis – Scan Report', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12);
    doc.text(`Patient Name: ${scan.patientName}`);
    doc.text(`Patient ID: ${scan.patientId}`);
    doc.text(`Scan Type: ${scan.scanType}`);
    doc.text(`Region: ${scan.region}`);
    doc.text(`Upload Date: ${scan.createdAt}`);
    doc.moveDown();

    try {
      // Fetch image data
      let imgBuffer;
      if (scan.imageUrl.startsWith('http')) {
        const resp = await axios.get(scan.imageUrl, { responseType: 'arraybuffer' });
        imgBuffer = Buffer.from(resp.data);
      } else {
        imgBuffer = fs.readFileSync(scan.imageUrl.replace(/^\//, ''));
      }
      doc.text('Scan Image:');
      doc.moveDown(0.5);
      doc.image(imgBuffer, { fit: [450, 300], align: 'center' });
    } catch (e) {
      doc.fillColor('red').text('Failed to load image for embedding.');
      doc.fillColor('black');
    }

    doc.end();
  });
}
