import express from 'express';
import { login, refresh, logout, getMe, changePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/change-password', protect, changePassword);

export default router;
