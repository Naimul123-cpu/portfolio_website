import express from 'express';
import { getAllStudy, createStudy, updateStudy, deleteStudy, reorderStudy } from '../controllers/study.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getAllStudy);
router.post('/', protect, adminOnly, upload.single('logo'), createStudy);
router.put('/:id', protect, adminOnly, upload.single('logo'), updateStudy);
router.delete('/:id', protect, adminOnly, deleteStudy);
router.patch('/reorder', protect, adminOnly, reorderStudy);

export default router;
