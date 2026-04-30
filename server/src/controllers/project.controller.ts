import { Request, Response } from 'express';
import Project from '../models/Project.model';
import cloudinary from '../config/cloudinary';

export const getAllProjects = async (req: Request, res: Response) => {
  try {
    const { category, featured } = req.query;
    const filter: any = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    const projects = await Project.find(filter).sort({ order: 1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const getProjectById = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createProject = async (req: Request, res: Response) => {
  const uploadedPublicIds: string[] = [];
  try {
    // Verify Cloudinary Config
    if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY)) {
      throw new Error('Cloudinary configuration is missing on the server.');
    }

    const data = { ...req.body };
    if (typeof data.technologies === 'string' && data.technologies.trim() !== '') {
      try {
        data.technologies = JSON.parse(data.technologies);
      } catch (e) {
        console.error('Failed to parse technologies:', e);
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail?.[0]) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.thumbnail[0].buffer);
      });
      data.thumbnail = result.secure_url;
      data.thumbnailPublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    if (files?.images && files.images.length > 0) {
      const imagesData = [];
      for (const file of files.images) {
        const result: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/projects' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imagesData.push({ url: result.secure_url, publicId: result.public_id });
        uploadedPublicIds.push(result.public_id);
      }
      data.images = imagesData;
    }

    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (error: any) {
    console.error('PROJECT CREATE ERROR:', error);
    for (const id of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(id);
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const uploadedPublicIds: string[] = [];
  try {
    // Verify Cloudinary Config
    if (!process.env.CLOUDINARY_URL && (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY)) {
      throw new Error('Cloudinary configuration is missing on the server.');
    }

    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ message: 'Project not found' });

    const data = { ...req.body };
    if (typeof data.technologies === 'string' && data.technologies.trim() !== '') {
      try {
        data.technologies = JSON.parse(data.technologies);
      } catch (e) {
        console.error('Failed to parse technologies:', e);
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail?.[0]) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.thumbnail[0].buffer);
      });
      
      if (existingProject.thumbnailPublicId) {
        try {
          await cloudinary.uploader.destroy(existingProject.thumbnailPublicId);
        } catch (err) {
          console.warn('Could not delete old thumbnail:', err);
        }
      }

      data.thumbnail = result.secure_url;
      data.thumbnailPublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    if (files?.images && files.images.length > 0) {
      const imagesData = [];
      for (const file of files.images) {
        const result: any = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/projects' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imagesData.push({ url: result.secure_url, publicId: result.public_id });
        uploadedPublicIds.push(result.public_id);
      }
      
      let oldImages = [];
      try {
        oldImages = data.images ? JSON.parse(data.images) : existingProject.images;
      } catch (e) {
        oldImages = existingProject.images;
      }
      data.images = [...oldImages, ...imagesData];
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json(project);
  } catch (error: any) {
    console.error('PROJECT UPDATE ERROR:', error);
    for (const id of uploadedPublicIds) {
      try {
        await cloudinary.uploader.destroy(id);
      } catch (cleanupErr) {
        console.error('Cleanup error:', cleanupErr);
      }
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Delete thumbnail
    if (project.thumbnailPublicId) {
      await cloudinary.uploader.destroy(project.thumbnailPublicId);
    }

    // Delete gallery images
    if (project.images && project.images.length > 0) {
      const deletePromises = project.images.map(img => cloudinary.uploader.destroy(img.publicId));
      await Promise.all(deletePromises);
    }

    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const reorderProject = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    for (const item of orders) {
      await Project.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
