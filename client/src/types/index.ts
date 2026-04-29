export interface IProfile {
  _id: string;
  name: string;
  tagline: string;
  bio: string;
  email: string;
  phone?: string;
  location?: string;
  avatar?: string;
  resumeUrl?: string;
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
  };
  skills: string[];
}

export interface IStudy {
  _id: string;
  institution: string;
  degree: string;
  field: string;
  startYear: string;
  endYear?: string;
  grade?: string;
  description?: string;
  logo?: string;
  institutionType: string;
  subjects: string[];
  order: number;
}

export interface IExperience {
  _id: string;
  company: string;
  role: string;
  type: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
  technologies: string[];
  logo?: string;
  workplaceType: string;
  workSamples: {
    type: 'image' | 'video';
    url: string;
    publicId: string;
    caption?: string;
    thumbnail?: string;
  }[];
  order: number;
}

export interface IProject {
  _id: string;
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

export interface IUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: IUser;
}
