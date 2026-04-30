import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

if (process.env.CLOUDINARY_URL) {
  // Manually parse cloudinary://api_key:api_secret@cloud_name
  const url = process.env.CLOUDINARY_URL.replace('cloudinary://', '');
  const [credentials, cloud_name] = url.split('@');
  const [api_key, api_secret] = credentials.split(':');
  cloudinary.config({ cloud_name, api_key, api_secret });
} else {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export default cloudinary;
