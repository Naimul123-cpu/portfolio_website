import mongoose, { Schema, Document } from 'mongoose';

export interface IProfile extends Document {
  name: string;
  logoText?: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  avatarPublicId?: string;
  resumeUrl: string;
  resumePublicId?: string;
  presentAddress?: string;
  permanentAddress?: string;
  whatsapp?: string;
  socialLinks: {
    github?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
    instagram?: string;
    youtube?: string;
    discord?: string;
    website?: string;
    tiktok?: string;
    reddit?: string;
    pinterest?: string;
    behance?: string;
    dribbble?: string;
    medium?: string;
    twitch?: string;
    slack?: string;
    telegram?: string;
    snapchat?: string;
    stackoverflow?: string;
    quora?: string;
    mastodon?: string;
    threads?: string;
  };
  skills: string[];
  heroVideoUrl?: string;
  videoPublicId?: string;
}

const profileSchema = new Schema<IProfile>(
  {
    name: { type: String, required: true },
    logoText: { type: String, default: 'NAIM.DEV' },
    tagline: { type: String, required: true },
    bio: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    location: { type: String },
    avatar: { type: String },
    avatarPublicId: { type: String },
    resumeUrl: { type: String },
    resumePublicId: { type: String },
    presentAddress: { type: String },
    permanentAddress: { type: String },
    whatsapp: { type: String },
    socialLinks: {
      github: { type: String },
      linkedin: { type: String },
      twitter: { type: String },
      facebook: { type: String },
      instagram: { type: String },
      youtube: { type: String },
      discord: { type: String },
      website: { type: String },
      tiktok: { type: String },
      reddit: { type: String },
      pinterest: { type: String },
      behance: { type: String },
      dribbble: { type: String },
      medium: { type: String },
      twitch: { type: String },
      slack: { type: String },
      telegram: { type: String },
      snapchat: { type: String },
      stackoverflow: { type: String },
      quora: { type: String },
      mastodon: { type: String },
      threads: { type: String },
    },
    skills: [{ type: String }],
    heroVideoUrl: { type: String },
    videoPublicId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IProfile>('Profile', profileSchema);
