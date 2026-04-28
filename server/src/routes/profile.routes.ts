import express from 'express';
import { getProfile, updateProfile } from '../controllers/profile.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getProfile);
router.put('/', protect, adminOnly, upload.fields([{ name: 'avatar', maxCount: 1 }, { name: 'resume', maxCount: 1 }]), updateProfile);

export default router;
