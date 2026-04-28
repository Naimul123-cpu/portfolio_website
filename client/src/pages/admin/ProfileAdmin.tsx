import React, { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import api from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';

const ProfileAdmin: React.FC = () => {
  const { profile, loading, refresh } = usePortfolioData();
  const [formData, setFormData] = useState<any>({
    name: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    location: '',
    socialLinks: { github: '', linkedin: '', twitter: '', website: '' },
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [resume, setResume] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFormData({
        ...profile,
        socialLinks: profile.socialLinks || { github: '', linkedin: '', twitter: '', website: '' },
        skills: profile.skills || []
      });
    }
  }, [profile]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('social_')) {
      const platform = name.split('_')[1];
      setFormData((prev: any) => ({
        ...prev,
        socialLinks: { ...prev.socialLinks, [platform]: value }
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData((prev: any) => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((s: string) => s !== skillToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'socialLinks' || key === 'skills') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key !== 'avatar' && key !== 'resumeUrl' && key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt') {
          data.append(key, formData[key]);
        }
      });

      if (avatar) data.append('avatar', avatar);
      if (resume) data.append('resume', resume);

      await api.put('/profile', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      toast.success('Profile updated successfully!');
      refresh();
    } catch (error: any) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="ml-64 p-10 bg-bg-primary min-h-screen">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-bold">Profile Settings</h1>
        <GlowButton onClick={handleSubmit} disabled={isSaving} className="flex items-center gap-2">
          {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
          Save Changes
        </GlowButton>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-8">
          {/* Basic Info */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Full Name</label>
                <input 
                  name="name" 
                  value={formData.name} 
                  onChange={handleInputChange}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Tagline</label>
                <input 
                  name="tagline" 
                  value={formData.tagline} 
                  onChange={handleInputChange}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Social Links</h2>
            <div className="grid grid-cols-2 gap-4">
              {['github', 'linkedin', 'twitter', 'website'].map(platform => (
                <div key={platform}>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2 capitalize">{platform}</label>
                  <input 
                    name={`social_${platform}`} 
                    value={formData.socialLinks[platform]} 
                    onChange={handleInputChange}
                    placeholder={`https://${platform}.com/...`}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* Assets */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Assets</h2>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Avatar</label>
                <div className="relative group cursor-pointer h-40 bg-bg-primary border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                  {avatar ? (
                    <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover" />
                  ) : formData.avatar ? (
                    <img src={formData.avatar} className="w-full h-full object-cover" />
                  ) : (
                    <>
                      <Upload className="text-text-secondary mb-2" />
                      <span className="text-xs text-text-secondary">Upload Image</span>
                    </>
                  )}
                  <input 
                    type="file" 
                    onChange={(e) => setAvatar(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Resume (PDF)</label>
                <div className="relative h-40 bg-bg-primary border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center">
                  <Upload className="text-text-secondary mb-2" />
                  <span className="text-xs text-text-secondary text-center px-4">
                    {resume ? resume.name : formData.resumeUrl ? 'Current Resume Uploaded' : 'Upload PDF'}
                  </span>
                  <input 
                    type="file" 
                    onChange={(e) => setResume(e.target.files?.[0] || null)}
                    className="absolute inset-0 opacity-0 cursor-pointer" 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Skills Management</h2>
            <div className="flex gap-2 mb-4">
              <input 
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                placeholder="Add a skill (e.g. React)"
                className="flex-grow bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
              />
              <button onClick={addSkill} className="p-3 bg-accent-primary rounded-xl hover:scale-105 transition-transform">
                <Plus size={24} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.skills.map((skill: string) => (
                <div key={skill} className="flex items-center gap-2 px-3 py-1.5 glass rounded-lg border-accent-primary/20 text-sm">
                  {skill}
                  <X size={14} className="cursor-pointer hover:text-accent-tertiary" onClick={() => removeSkill(skill)} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;
