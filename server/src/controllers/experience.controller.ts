import { Request, Response } from 'express';
import Experience from '../models/Experience.model';
import cloudinary from '../config/cloudinary';

export const getAllExperience = async (req: Request, res: Response) => {
  try {
    const experiences = await Experience.find().sort({ order: 1 });
    res.json(experiences);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createExperience = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);
    
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      data.logo = (result as any).secure_url;
    }
    const experience = await Experience.create(data);
    res.status(201).json(experience);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
    if (typeof data.technologies === 'string') data.technologies = JSON.parse(data.technologies);

    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      data.logo = (result as any).secure_url;
    }
    const experience = await Experience.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: 'Experience deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const reorderExperience = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body;
    for (const item of orders) {
      await Experience.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
