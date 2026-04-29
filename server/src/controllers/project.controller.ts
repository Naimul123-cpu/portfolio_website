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
    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail) {
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

    if (files?.images) {
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
  } catch (error) {
    // Cleanup uploaded files on failure
    for (const id of uploadedPublicIds) {
      await cloudinary.uploader.destroy(id);
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProject = async (req: Request, res: Response) => {
  const uploadedPublicIds: string[] = [];
  try {
    const existingProject = await Project.findById(req.params.id);
    if (!existingProject) return res.status(404).json({ message: 'Project not found' });

    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.thumbnail) {
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
      
      // Delete old thumbnail
      if (existingProject.thumbnailPublicId) {
        await cloudinary.uploader.destroy(existingProject.thumbnailPublicId);
      }

      data.thumbnail = result.secure_url;
      data.thumbnailPublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    if (files?.images) {
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
      
      const oldImages = data.images ? JSON.parse(data.images) : existingProject.images;
      data.images = [...oldImages, ...imagesData];
    }

    const project = await Project.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(project);
  } catch (error) {
    for (const id of uploadedPublicIds) {
      await cloudinary.uploader.destroy(id);
    }
    res.status(500).json({ message: (error as Error).message });
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
