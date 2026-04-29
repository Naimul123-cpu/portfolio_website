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
  let uploadedPublicId: string | null = null;
  try {
    const data = { ...req.body };
    if (typeof data.subjects === 'string') {
      try {
        data.subjects = JSON.parse(data.subjects);
      } catch (e) {
        data.subjects = [];
      }
    }
    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });
      data.logo = result.secure_url;
      data.logoPublicId = result.public_id;
      uploadedPublicId = result.public_id;
    }
    const study = await Study.create(data);
    res.status(201).json(study);
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId);
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateStudy = async (req: Request, res: Response) => {
  let uploadedPublicId: string | null = null;
  try {
    const existingStudy = await Study.findById(req.params.id);
    if (!existingStudy) return res.status(404).json({ message: 'Study not found' });

    const data = { ...req.body };
    if (typeof data.subjects === 'string') {
      try {
        data.subjects = JSON.parse(data.subjects);
      } catch (e) {
        data.subjects = [];
      }
    }
    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/logos' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(req.file!.buffer);
      });

      // Delete old logo
      if (existingStudy.logoPublicId) {
        await cloudinary.uploader.destroy(existingStudy.logoPublicId);
      }

      data.logo = result.secure_url;
      data.logoPublicId = result.public_id;
      uploadedPublicId = result.public_id;
    }
    const study = await Study.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(study);
  } catch (error) {
    if (uploadedPublicId) {
      await cloudinary.uploader.destroy(uploadedPublicId);
    }
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteStudy = async (req: Request, res: Response) => {
  try {
    const study = await Study.findById(req.params.id);
    if (!study) return res.status(404).json({ message: 'Study not found' });

    // Delete logo from Cloudinary
    if (study.logoPublicId) {
      await cloudinary.uploader.destroy(study.logoPublicId);
    }

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
