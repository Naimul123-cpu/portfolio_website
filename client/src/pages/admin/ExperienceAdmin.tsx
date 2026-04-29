import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Loader2, Briefcase, Calendar, Eye, Play, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ExperienceAdmin: React.FC = () => {
  const { experiences, refresh } = usePortfolioData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    company: '',
    role: '',
    type: 'Full-time',
    workplaceType: 'Company',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: [],
    workSamples: [],
    order: 0
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');
  const [uploadingSamples, setUploadingSamples] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      type: 'Full-time',
      workplaceType: 'Company',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: [],
      workSamples: [],
      order: 0
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    const formattedData = {
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      workSamples: exp.workSamples || []
    };
    setFormData(formattedData);
    setLogo(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev: any) => ({ ...prev, [name]: val }));
  };

  const handleSampleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingExp) return;

    setUploadingSamples(true);
    setUploadProgress(0);

    const data = new FormData();
    Array.from(files).forEach(file => data.append('samples', file));

    try {
      const response = await api.post(`/experience/${editingExp._id}/work-samples`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
          setUploadProgress(percentCompleted);
        }
      });
      setFormData((prev: any) => ({ ...prev, workSamples: response.data.workSamples }));
      toast.success('Samples uploaded successfully!');
      refresh();
    } catch (error) {
      toast.error('Failed to upload samples');
    } finally {
      setUploadingSamples(false);
    }
  };

  const deleteSample = async (sampleId: string) => {
    if (!window.confirm('Delete this work sample?')) return;
    try {
      const response = await api.delete(`/experience/${editingExp._id}/work-samples/${sampleId}`);
      setFormData((prev: any) => ({ ...prev, workSamples: response.data.workSamples }));
      toast.success('Sample deleted');
      refresh();
    } catch (error) {
      toast.error('Failed to delete sample');
    }
  };

  const addTech = () => {
    if (techInput && !formData.technologies.includes(techInput)) {
      setFormData((prev: any) => ({
        ...prev,
        technologies: [...prev.technologies, techInput]
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData((prev: any) => ({
      ...prev,
      technologies: prev.technologies.filter((t: string) => t !== tech)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'technologies') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'logo' && key !== 'workSamples') {
          data.append(key, formData[key]);
        }
      });

      if (logo) data.append('logo', logo);

      if (editingExp) {
        await api.put(`/experience/${editingExp._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Experience updated!');
      } else {
        const response = await api.post('/experience', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Experience added! You can now add work samples.');
        setEditingExp(response.data);
        setFormData((prev: any) => ({...prev, _id: response.data._id}));
      }
      
      refresh();
    } catch (error: any) {
      toast.error('Failed to save experience');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this experience?')) {
      try {
        await api.delete(`/experience/${id}`);
        toast.success('Experience deleted');
        refresh();
      } catch (error) {
        toast.error('Failed to delete experience');
      }
    }
  };

  return (
      </main>

      {/* Modal - Moved outside main for perfect centering */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-base/90 backdrop-blur-md" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass rounded-[32px] md:rounded-[48px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-glow-violet border border-white/10 flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-violet mb-2">Career Protocol</p>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">
                    {editingExp ? 'Modify' : 'Initialize'} <span className="text-gradient">Experience</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto scrollbar-hide">
                <form onSubmit={handleSubmit} className="space-y-10">
                  <div className="grid md:grid-cols-2 gap-8 md:gap-10">
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Organization</label>
                          <input name="company" value={formData.company} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Emblem</label>
                          <div className="relative group glass bg-white/5 border border-dashed border-white/20 rounded-2xl h-[58px] flex items-center justify-center hover:border-accent-violet/50 transition-all">
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{logo ? logo.name : 'Upload Brand'}</span>
                            <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Position Title</label>
                        <input name="role" value={formData.role} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Job Architecture</label>
                          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-bold appearance-none cursor-pointer">
                            <option value="Full-time">Full-time Flow</option>
                            <option value="Part-time">Part-time Flow</option>
                            <option value="Freelance">Freelance Contract</option>
                            <option value="Internship">Learning Node</option>
                          </select>
                        </div>
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Environment</label>
                          <select name="workplaceType" value={formData.workplaceType} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-bold appearance-none cursor-pointer">
                            {['Company', 'Business', 'Freelance', 'Remote', 'Own Business', 'NGO', 'Government', 'Other'].map(type => (
                              <option key={type} value={type}>{type}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Initiation Date</label>
                          <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                        </div>
                        <div className="space-y-3">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Termination Date</label>
                          <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} disabled={formData.isCurrent} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium disabled:opacity-30" />
                        </div>
                      </div>

                      <div className="p-6 glass bg-accent-violet/5 border border-white/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleInputChange} className="w-5 h-5 rounded border-white/10 bg-white/5 text-accent-violet focus:ring-accent-violet" />
                          <label className="text-[10px] font-black text-text-primary uppercase tracking-widest">Active Engagement</label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Mission Parameters</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full glass bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-6 text-text-primary outline-none focus:border-accent-violet transition-all font-medium leading-relaxed" />
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Capability Stack</label>
                        <div className="flex gap-4 mb-4">
                          <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-grow glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" placeholder="Add tech..." />
                          <button type="button" onClick={addTech} className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-110 transition-all"><Plus size={24} /></button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {formData.technologies.map((tech: string) => (
                            <span key={tech} className="flex items-center gap-3 px-5 py-2.5 glass rounded-2xl border-white/5 text-[11px] font-black text-text-primary uppercase tracking-widest group">
                              {tech}
                              <X size={14} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors" onClick={() => removeTech(tech)} />
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-8 border-t border-white/10">
                        <h3 className="text-xl font-black text-text-primary tracking-tight mb-6 flex items-center gap-3">
                          <Eye size={20} className="text-accent-blue" />
                          Evidence Repository
                        </h3>
                        {!editingExp ? (
                          <div className="p-8 glass rounded-3xl border border-white/5 text-center">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">Initialize experience protocol first to upload evidence.</p>
                          </div>
                        ) : (
                          <div className="space-y-8">
                            <div className="relative group aspect-video glass bg-white/5 border border-dashed border-white/20 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-blue/50 transition-all duration-500">
                              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                              {uploadingSamples ? (
                                <div className="text-center">
                                  <Loader2 className="animate-spin text-accent-blue mb-4 mx-auto" size={32} />
                                  <p className="text-[10px] font-black text-text-primary uppercase tracking-[0.2em]">Uploading Evidence... {uploadProgress}%</p>
                                </div>
                              ) : (
                                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                  <Upload className="text-accent-blue mb-4 mx-auto" size={32} />
                                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Inject Images/Videos</span>
                                </div>
                              )}
                              <input type="file" multiple accept="image/*,video/*" onChange={handleSampleUpload} disabled={uploadingSamples} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                              {formData.workSamples.map((sample: any) => (
                                <div key={sample._id} className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/10 group/sample">
                                  {sample.type === 'image' ? (
                                    <img src={sample.url} alt="" className="w-full h-full object-cover transition-transform duration-500 group-hover/sample:scale-110" />
                                  ) : (
                                    <div className="w-full h-full bg-bg-surface flex items-center justify-center text-accent-blue">
                                      <Play size={24} />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-bg-base/80 opacity-0 group-hover/sample:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <button type="button" onClick={() => deleteSample(sample._id)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all">
                                      <Trash2 size={16} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <GlowButton type="submit" disabled={isSaving} size="lg" className="w-full py-5 shadow-glow-violet">
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={24} /> : <Save className="mr-2" size={24} />}
                    <span className="font-black text-base">{editingExp ? 'SYNC CAREER NODE' : 'LAUNCH CAREER NODE'}</span>
                  </GlowButton>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExperienceAdmin;
