import React, { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Plus, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import api from '../../services/api';
import GlowButton from '../../components/ui/GlowButton';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ProfileAdmin: React.FC = () => {
  const { profile, loading, refresh } = usePortfolioData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<any>({
    name: '',
    tagline: '',
    bio: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    presentAddress: '',
    permanentAddress: '',
    socialLinks: { github: '', linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '', discord: '', website: '' },
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
        socialLinks: profile.socialLinks || { github: '', linkedin: '', twitter: '', facebook: '', instagram: '', youtube: '', discord: '', website: '' },
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
    if (e) e.preventDefault();
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
    <div className="min-h-screen bg-bg-base flex overflow-hidden">
      {/* Aurora Orbs for Admin */}
      <div className="aurora-container opacity-20">
        <div className="aurora-orb orb-1 scale-75" />
        <div className="aurora-orb orb-3 scale-75" />
      </div>
      <div className="bg-texture opacity-[0.02]" />

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-grow lg:ml-72 p-6 md:p-12 relative z-10 overflow-y-auto max-h-screen scrollbar-hide">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 glass rounded-2xl text-accent-violet shadow-glow-violet"
            >
              <Plus size={24} />
            </button>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent-violet border border-white/10">
                  Identity Management
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tight">
                Profile <span className="text-gradient bg-gradient-aurora">Configuration</span>
              </h1>
              <p className="mt-4 text-text-secondary font-medium tracking-wide text-lg">Define how the world sees your engineering persona.</p>
            </div>
          </div>
          <GlowButton onClick={handleSubmit} disabled={isSaving} className="flex items-center gap-3 px-10 py-4 shadow-glow-violet">
            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            <span className="font-black">SYNC CHANGES</span>
          </GlowButton>
        </header>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="space-y-10">
            {/* Basic Info */}
            <div className="glass p-10 rounded-[40px] border border-white/10 relative group">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-primary opacity-30" />
              <h2 className="text-2xl font-black mb-10 text-text-primary tracking-tight flex items-center gap-4">
                <span className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-violet"><Plus size={20} /></span>
                Core Information
              </h2>
              <div className="space-y-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Public Name</label>
                    <input name="name" value={formData.name} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Professional Title</label>
                    <input name="tagline" value={formData.tagline} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium" />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Email Endpoint</label>
                    <input name="email" value={formData.email} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium" />
                  </div>
                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Contact Line</label>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium" />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Narrative Biography</label>
                  <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} className="w-full glass bg-white/5 border border-white/10 rounded-3xl p-6 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium leading-relaxed" />
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="glass p-10 rounded-[40px] border border-white/10">
              <h2 className="text-2xl font-black mb-10 text-text-primary tracking-tight">Digital Presence</h2>
              <div className="grid grid-cols-2 gap-6">
                {['github', 'linkedin', 'twitter', 'discord'].map(platform => (
                  <div key={platform} className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 capitalize">{platform}</label>
                    <input 
                      name={`social_${platform}`} 
                      value={formData.socialLinks[platform]} 
                      onChange={handleInputChange}
                      placeholder={`https://${platform}.com/...`}
                      className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-10">
            {/* Assets */}
            <div className="glass p-10 rounded-[40px] border border-white/10">
              <h2 className="text-2xl font-black mb-10 text-text-primary tracking-tight">Visual Identity</h2>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 text-center">Avatar Profile</label>
                  <div className="relative group cursor-pointer aspect-square glass bg-white/5 border border-dashed border-white/20 rounded-[32px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-violet/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform duration-500">
                        <Upload className="text-accent-violet mb-4 mx-auto" size={32} />
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Upload Frame</span>
                      </div>
                    )}
                    <input type="file" onChange={(e) => setAvatar(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2 text-center">Resume Protocol (PDF)</label>
                  <div className="relative group aspect-square glass bg-white/5 border border-dashed border-white/20 rounded-[32px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-blue/50 transition-all duration-500">
                    <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Upload className="text-accent-blue mb-4 group-hover:scale-110 transition-transform duration-500" size={32} />
                    <span className="text-[10px] font-black text-text-muted uppercase tracking-widest text-center px-6">
                      {resume ? resume.name : formData.resumeUrl ? 'Active Protocol Loaded' : 'Deploy PDF'}
                    </span>
                    <input type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="glass p-10 rounded-[40px] border border-white/10">
              <h2 className="text-2xl font-black mb-10 text-text-primary tracking-tight">Engineering Expertise</h2>
              <div className="flex gap-4 mb-8">
                <input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Incorporate new tech..."
                  className="flex-grow glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium"
                />
                <button onClick={addSkill} className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-110 transition-all active:scale-95">
                  <Plus size={24} />
                </button>
              </div>
              <div className="flex flex-wrap gap-3">
                {formData.skills.map((skill: string) => (
                  <div key={skill} className="flex items-center gap-3 px-5 py-2.5 glass rounded-2xl border-white/5 text-xs font-bold text-text-primary hover:border-accent-violet/30 transition-all group">
                    {skill}
                    <X size={14} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors" onClick={() => removeSkill(skill)} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileAdmin;
