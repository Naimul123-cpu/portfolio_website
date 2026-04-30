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
  let uploadedPublicId: string | null = null;
  try {
    const data = { ...req.body };

    // Safely parse JSON fields
    if (typeof data.technologies === 'string' && data.technologies.trim() !== '') {
      try { data.technologies = JSON.parse(data.technologies); } catch { data.technologies = []; }
    }
    if (typeof data.workSamples === 'string' && data.workSamples.trim() !== '') {
      try { data.workSamples = JSON.parse(data.workSamples); } catch { data.workSamples = []; }
    }
    // Convert date strings to Date objects
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    // Convert isCurrent string to boolean
    if (typeof data.isCurrent === 'string') data.isCurrent = data.isCurrent === 'true';

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
    const experience = await Experience.create(data);
    res.status(201).json(experience);
  } catch (error: any) {
    console.error('CREATE EXPERIENCE ERROR:', error);
    if (uploadedPublicId) {
      try { await cloudinary.uploader.destroy(uploadedPublicId); } catch {}
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const updateExperience = async (req: Request, res: Response) => {
  let uploadedPublicId: string | null = null;
  try {
    const existingExp = await Experience.findById(req.params.id);
    if (!existingExp) return res.status(404).json({ message: 'Experience not found' });

    const data = { ...req.body };

    // Safely parse JSON fields
    if (typeof data.technologies === 'string' && data.technologies.trim() !== '') {
      try { data.technologies = JSON.parse(data.technologies); } catch { data.technologies = []; }
    }
    if (typeof data.workSamples === 'string' && data.workSamples.trim() !== '') {
      try { data.workSamples = JSON.parse(data.workSamples); } catch { data.workSamples = []; }
    }
    // Convert date strings to Date objects
    if (data.startDate) data.startDate = new Date(data.startDate);
    if (data.endDate) data.endDate = new Date(data.endDate);
    // Convert isCurrent string to boolean
    if (typeof data.isCurrent === 'string') data.isCurrent = data.isCurrent === 'true';

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

      if (existingExp.logoPublicId) {
        try { await cloudinary.uploader.destroy(existingExp.logoPublicId); } catch {}
      }
    }
    
    const experience = await Experience.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json(experience);
  } catch (error: any) {
    console.error('UPDATE EXPERIENCE ERROR:', error);
    if (uploadedPublicId) {
      try { await cloudinary.uploader.destroy(uploadedPublicId); } catch {}
    }
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const deleteExperience = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    // Delete logo from Cloudinary
    if (experience.logoPublicId) {
      await cloudinary.uploader.destroy(experience.logoPublicId);
    }

    // Delete work samples from Cloudinary
    if (experience.workSamples && experience.workSamples.length > 0) {
      const deletePromises = experience.workSamples.map(sample => 
        cloudinary.uploader.destroy(sample.publicId, { resource_type: sample.type === 'video' ? 'video' : 'image' })
      );
      await Promise.all(deletePromises);
    }

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
export const uploadWorkSamples = async (req: Request, res: Response) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    const files = req.files as Express.Multer.File[];
    if (!files || files.length === 0) return res.status(400).json({ message: 'No files uploaded' });

    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { 
            folder: 'portfolio/work-samples',
            resource_type: 'auto'
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(file.buffer);
      });
    });

    const results = await Promise.all(uploadPromises);
    const newSamples = results.map((result: any) => ({
      type: result.resource_type === 'video' ? 'video' : 'image',
      url: result.secure_url,
      publicId: result.public_id,
      thumbnail: result.resource_type === 'video' ? result.secure_url.replace(/\.[^/.]+$/, ".jpg") : undefined
    }));

    experience.workSamples.push(...(newSamples as any));
    await experience.save();

    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const deleteWorkSample = async (req: Request, res: Response) => {
  try {
    const { id, sampleId } = req.params;
    const experience = await Experience.findById(id);
    if (!experience) return res.status(404).json({ message: 'Experience not found' });

    const sample = experience.workSamples.find((s: any) => s._id.toString() === sampleId);
    if (!sample) return res.status(404).json({ message: 'Sample not found' });

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(sample.publicId, { resource_type: sample.type === 'video' ? 'video' : 'image' });

    // Remove from DB
    experience.workSamples = experience.workSamples.filter((s: any) => s._id.toString() !== sampleId);
    await experience.save();

    res.json(experience);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
