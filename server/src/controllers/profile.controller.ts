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
  const uploadedPublicIds: string[] = [];
  try {
    // Verify Cloudinary Config
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY) {
      throw new Error('Cloudinary configuration is missing on the server.');
    }

    let profile = await Profile.findOne();
    const data = { ...req.body };

    // Parse socialLinks and skills if they are strings (from form-data)
    if (typeof data.socialLinks === 'string' && data.socialLinks.trim() !== '') {
      try {
        data.socialLinks = JSON.parse(data.socialLinks);
      } catch (e) {
        console.error('Failed to parse socialLinks:', e);
      }
    }
    if (typeof data.skills === 'string' && data.skills.trim() !== '') {
      try {
        data.skills = JSON.parse(data.skills);
      } catch (e) {
        console.error('Failed to parse skills:', e);
      }
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    if (files?.avatar?.[0]) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/avatars' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.avatar[0].buffer);
      });

      if (profile?.avatarPublicId) {
        try {
          await cloudinary.uploader.destroy(profile.avatarPublicId);
        } catch (err) {
          console.warn('Could not delete old avatar:', err);
        }
      }

      data.avatar = result.secure_url;
      data.avatarPublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    if (files?.resume?.[0]) {
      const result: any = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: 'portfolio/resumes', resource_type: 'raw' },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );
        stream.end(files.resume[0].buffer);
      });

      if (profile?.resumePublicId) {
        try {
          await cloudinary.uploader.destroy(profile.resumePublicId, { resource_type: 'raw' });
        } catch (err) {
          console.warn('Could not delete old resume:', err);
        }
      }

      data.resumeUrl = result.secure_url;
      data.resumePublicId = result.public_id;
      uploadedPublicIds.push(result.public_id);
    }

    if (profile) {
      profile = await Profile.findByIdAndUpdate(profile._id, data, { new: true, runValidators: true });
    } else {
      profile = await Profile.create(data);
    }

    res.json(profile);
  } catch (error: any) {
    console.error('PROFILE UPDATE ERROR:', error);
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
