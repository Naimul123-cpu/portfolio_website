import multer from 'multer';
import path from 'path';

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const allowedExtensions = /jpeg|jpg|png|gif|webp|svg|bmp|tiff|mp4|mov|avi|mkv|webm/;
  const extname = allowedExtensions.test(path.extname(file.originalname).toLowerCase());
  
  // For resource_type: 'auto' in cloudinary, we can be more flexible with mimetypes
  if (extname) {
    return cb(null, true);
  } else {
    cb(new Error('Unsupported file format!'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB limit as requested
});

export default upload;
