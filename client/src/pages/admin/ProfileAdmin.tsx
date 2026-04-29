import React, { useState, useEffect } from 'react';
import { Save, Loader2, Upload, Plus, X, User, Shield, Zap, Globe, Cpu } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import api from '../../services/api';
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

  const handleSubmit = async (e?: React.FormEvent) => {
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

      toast.success('Identity Optimized Successfully');
      refresh();
    } catch (error: any) {
      toast.error('Identity Sync Failed');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050508] flex items-center justify-center">
      <Loader2 className="animate-spin text-accent-violet" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050508] flex overflow-hidden">
      <div className="aurora-container opacity-20">
        <div className="aurora-orb orb-1 scale-75" />
        <div className="aurora-orb orb-2 scale-75" />
      </div>
      <div className="bg-texture opacity-[0.02]" />

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-grow lg:ml-80 p-6 md:p-14 relative z-10 overflow-y-auto max-h-screen scrollbar-hide">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <User size={16} className="text-accent-violet" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-violet">Identity Core</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">
              Profile <span className="text-gradient">Console</span>
            </h1>
            <p className="mt-4 text-text-muted font-medium tracking-wide text-base md:text-lg opacity-80 uppercase text-[11px] tracking-[0.2em]">Define how the world sees your engineering persona.</p>
          </div>
          <button 
            onClick={handleSubmit} 
            disabled={isSaving}
            className="group relative px-10 py-5 bg-gradient-primary rounded-[32px] font-black text-[11px] uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow-violet disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
              Sync Parameters
            </span>
          </button>
        </header>

        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left Column - Core Data */}
          <div className="lg:col-span-7 space-y-12">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
              <div className="relative glass p-10 md:p-14 rounded-[40px] border border-white/5 bg-[#0A0A12]/60">
                <div className="flex items-center gap-4 mb-12">
                  <Shield size={24} className="text-accent-violet" />
                  <h2 className="text-3xl font-black text-text-primary tracking-tighter">Core Attributes</h2>
                </div>
                <div className="space-y-10">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Public Name</label>
                      <input name="name" value={formData.name} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Professional Title</label>
                      <input name="tagline" value={formData.tagline} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Email Endpoint</label>
                      <input name="email" value={formData.email} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium" />
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Contact Line</label>
                      <input name="phone" value={formData.phone} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Narrative Biography</label>
                    <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={6} className="w-full glass bg-white/[0.03] border border-white/5 rounded-[32px] p-8 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium leading-relaxed" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-10 md:p-14 rounded-[40px] border border-white/5 bg-[#0D0D16]/40">
              <div className="flex items-center gap-4 mb-12">
                <Globe size={24} className="text-accent-cyan" />
                <h2 className="text-3xl font-black text-text-primary tracking-tighter">Digital Presence</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {['github', 'linkedin', 'twitter', 'discord'].map(platform => (
                  <div key={platform} className="space-y-4">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2 capitalize">{platform}</label>
                    <input 
                      name={`social_${platform}`} 
                      value={formData.socialLinks[platform]} 
                      onChange={handleInputChange}
                      placeholder={`https://${platform}.com/...`}
                      className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 focus:bg-white/[0.05] transition-all font-medium"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Assets & Skills */}
          <div className="lg:col-span-5 space-y-12">
            <div className="glass p-10 md:p-14 rounded-[40px] border border-white/5 bg-[#0D0D16]/40">
              <h2 className="text-2xl font-black mb-12 text-text-primary tracking-tight">Visual Identity Assets</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] text-center">Avatar Profile</label>
                  <div className="relative group cursor-pointer aspect-square glass bg-white/[0.03] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-violet/40 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                    {avatar ? (
                      <img src={URL.createObjectURL(avatar)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    ) : formData.avatar ? (
                      <img src={formData.avatar} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    ) : (
                      <div className="text-center group-hover:scale-110 transition-transform duration-500">
                        <Upload className="text-accent-violet mb-4 mx-auto" size={40} />
                        <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Deploy Avatar</span>
                      </div>
                    )}
                    <input type="file" onChange={(e) => setAvatar(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] text-center">Resume Protocol (PDF)</label>
                  <div className="relative group aspect-square glass bg-white/[0.03] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-cyan/40 transition-all duration-700">
                    <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                    <Upload className="text-accent-cyan mb-4 group-hover:scale-110 transition-transform duration-500" size={40} />
                    <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em] text-center px-8 leading-relaxed">
                      {resume ? resume.name : formData.resumeUrl ? 'Active Protocol Loaded' : 'Initialize PDF'}
                    </span>
                    <input type="file" onChange={(e) => setResume(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>

            <div className="glass p-10 md:p-14 rounded-[40px] border border-white/5 bg-[#0A0A12]/60">
              <div className="flex items-center gap-4 mb-12">
                <Cpu size={24} className="text-accent-violet" />
                <h2 className="text-3xl font-black text-text-primary tracking-tighter">Capabilities Stack</h2>
              </div>
              <div className="flex gap-4 mb-10">
                <input 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  placeholder="Incorporate Tech..."
                  className="flex-grow glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 transition-all font-medium"
                />
                <button onClick={addSkill} className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-105 transition-all active:scale-95">
                  <Plus size={28} />
                </button>
              </div>
              <div className="flex flex-wrap gap-4">
                {formData.skills.map((skill: string) => (
                  <span key={skill} className="flex items-center gap-4 px-6 py-3 glass rounded-2xl border border-white/5 text-[11px] font-black text-text-primary uppercase tracking-widest group bg-white/[0.02] hover:border-accent-violet/30 transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-glow-violet" />
                    {skill}
                    <X size={16} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors ml-2" onClick={() => removeSkill(skill)} />
                  </span>
                ))}
              </div>
            </div>

            <div className="p-10 glass rounded-[40px] border border-white/5 bg-gradient-to-br from-accent-violet/10 to-transparent">
              <h3 className="text-xl font-black text-text-primary mb-4 flex items-center gap-3">
                <Zap size={20} className="text-accent-violet" /> 
                Deployment Readiness
              </h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] leading-relaxed">
                Profile modifications are broadcast across the entire engineering portfolio instantly. Ensure your narrative reflects your current capability.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfileAdmin;
