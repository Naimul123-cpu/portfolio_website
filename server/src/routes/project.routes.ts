import express from 'express';
import { getAllProjects, getProjectById, createProject, updateProject, deleteProject, reorderProject } from '../controllers/project.controller';
import { protect, adminOnly } from '../middleware/auth.middleware';
import upload from '../middleware/upload.middleware';

const router = express.Router();

router.get('/', getAllProjects);
router.get('/:id', getProjectById);
router.post('/', protect, adminOnly, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]), createProject);
router.put('/:id', protect, adminOnly, upload.fields([{ name: 'thumbnail', maxCount: 1 }, { name: 'images', maxCount: 10 }]), updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.patch('/reorder', protect, adminOnly, reorderProject);

export default router;
