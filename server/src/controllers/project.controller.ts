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
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.thumbnail[0].buffer);
      });
      data.thumbnail = (result as any).secure_url;
    }

    if (files?.images) {
      const imageUrls = [];
      for (const file of files.images) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/projects' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push((result as any).secure_url);
      }
      data.images = imageUrls;
    }

    const project = await Project.create(data);
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/projects' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.thumbnail[0].buffer);
      });
      data.thumbnail = (result as any).secure_url;
    }

    if (files?.images) {
      const imageUrls = [];
      for (const file of files.images) {
        const result = await new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            { folder: 'portfolio/projects' },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.end(file.buffer);
        });
        imageUrls.push((result as any).secure_url);
      }
      data.images = data.images ? [...JSON.parse(data.images), ...imageUrls] : imageUrls;
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteProject = async (req: Request, res: Response) => {
  try {
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
