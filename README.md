# OralVis Healthcare – Full Stack Task

This is a complete minimal implementation with:
- Role-based login (Technician, Dentist)
- Technician upload to Cloudinary (or local fallback) + SQLite persistence
- Dentist viewer with thumbnails + full-size access
- Per-scan downloadable PDF report (server-generated with embedded image)
- Ready for deployment (Render/Railway for server, Vercel/Netlify for client)

## Project Structure
```
oralvis-healthcare-app/
  server/      # Express + SQLite + PDFKit + Cloudinary/local storage
  client/      # React (Vite)
```

## Local Development (All)
1) **Server**
```bash
cd server
cp .env.example .env
# set Cloudinary vars (optional)
npm install
npm run dev
```

2) **Client**
```bash
cd ../client
npm install
npm run dev
```

### Demo Accounts
- technician@example.com / password
- dentist@example.com / password

## Deployment Tips
- **Server**: Render/Railway/Fly. Persist `data.db` using a volume, and set env vars.
- **Client**: Vercel/Netlify. Set `VITE_API_BASE` to your server URL.

## Notes
- If Cloudinary is not configured, images are stored locally under `/uploads` and served statically.
- The PDF endpoint streams a report built with PDFKit and embeds the scan image.
