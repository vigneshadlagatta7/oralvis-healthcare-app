import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
dotenv.config();

const useCloudinary = process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET;

let upload;

if (useCloudinary) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });

  const storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: process.env.CLOUDINARY_FOLDER || 'oralvis',
      allowed_formats: ['jpg', 'jpeg', 'png']
    }
  });
  upload = multer({ storage });
} else {
  // fallback to local storage
  const dir = 'uploads';
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, unique + ext);
    }
  });
  upload = multer({ storage });
}

export { upload, useCloudinary };
