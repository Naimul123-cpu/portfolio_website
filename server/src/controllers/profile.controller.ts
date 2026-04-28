import { Request, Response } from 'express';
import Profile from '../models/Profile.model';
import cloudinary from '../config/cloudinary';

export const getProfile = async (req: Request, res: Response) => {
  try {
    const profile = await Profile.findOne();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    let profile = await Profile.findOne();
    const data = { ...req.body };

    // Parse socialLinks and skills if they are strings (from form-data)
    if (typeof data.socialLinks === 'string') data.socialLinks = JSON.parse(data.socialLinks);
    if (typeof data.skills === 'string') data.skills = JSON.parse(data.skills);

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.avatar) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/avatars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.avatar[0].buffer);
      });
      data.avatar = (result as any).secure_url;
    }

    if (files?.resume) {
      const result = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/resumes', resource_type: 'raw' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.resume[0].buffer);
      });
      data.resumeUrl = (result as any).secure_url;
    }

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true });
    } else {
      profile = await Profile.create(data);
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
