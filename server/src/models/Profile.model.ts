import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  resumeUrl: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  skills: string[];
  heroVideoUrl?: string;
}

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    avatar: { type: String },
    resumeUrl: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      website: { type: String },
    },
    skills: [{ type: String }],
    heroVideoUrl: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', profileSchema);
