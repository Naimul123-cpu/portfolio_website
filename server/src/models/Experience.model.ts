import mongoose, { Schema, Document } from 'mongoose';

export interface IExperience extends Document {
  company: string;
  role: string;
  type: string;
  startDate: Date;
  endDate?: Date;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  logo?: string;
  order: number;
}

const experienceSchema = new Schema<IExperience>(
  {
    company: { type: String, required: true },
    role: { type: String, required: true },
    type: { type: String, required: true }, // Full-time, Part-time, Freelance, Internship
    startDate: { type: Date, required: true },
    endDate: { type: Date },
    isCurrent: { type: Boolean, default: false },
    description: { type: String },
    technologies: [{ type: String }],
    logo: { type: String },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IExperience>('Experience', experienceSchema);
