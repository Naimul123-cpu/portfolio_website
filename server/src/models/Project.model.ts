import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  longDescription?: string;
  thumbnail?: string;
  images: string[];
  technologies: string[];
  category: string;
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  order: number;
  status: string;
}

const projectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    longDescription: { type: String },
    thumbnail: { type: String },
    images: [{ type: String }],
    technologies: [{ type: String }],
    category: { type: String },
    liveUrl: { type: String },
    githubUrl: { type: String },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    status: { type: String, default: 'completed' }, // completed, in-progress, archived
  },
  { timestamps: true }
);

export default mongoose.model<IProject>('Project', projectSchema);
