import { Request, Response } from 'express';
import Study from '../models/Study.model';
import cloudinary from '../config/cloudinary';

export const getAllStudy = async (req: Request, res: Response) => {
  try {
    const studies = await Study.find().sort({ order: 1 });
    res.json(studies);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const createStudy = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
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
    const study = await Study.create(data);
    res.status(201).json(study);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateStudy = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };
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
    const study = await Study.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(study);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteStudy = async (req: Request, res: Response) => {
  try {
    await Study.findByIdAndDelete(req.params.id);
    res.json({ message: 'Study deleted' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const reorderStudy = async (req: Request, res: Response) => {
  try {
    const { orders } = req.body; // Array of { id, order }
    for (const item of orders) {
      await Study.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Order updated' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
