import mongoose, { Schema, Document } from 'mongoose';

export interface IStudy extends Document {
  institution: string;
  degree: string;
  field: string;
  startYear: number;
  endYear?: number;
  grade?: string;
  description?: string;
  logo?: string;
  logoPublicId?: string;
  institutionType: 'School' | 'College' | 'University' | 'Online Course' | 'Training Institute' | 'Certification' | 'Other';
  subjects: string[];
  order: number;
}

const studySchema = new Schema<IStudy>(
  {
    institution: { type: String, required: true },
    degree: { type: String, required: true },
    field: { type: String },
    startYear: { type: Number, required: true },
    endYear: { type: Number },
    grade: { type: String },
    description: { type: String },
    logo: { type: String },
    logoPublicId: { type: String },
    institutionType: {
      type: String,
      enum: ['School', 'College', 'University', 'Online Course', 'Training Institute', 'Certification', 'Other'],
      required: true
    },
    subjects: [{ type: String }],
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model<IStudy>('Study', studySchema);
