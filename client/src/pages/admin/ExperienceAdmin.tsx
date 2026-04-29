import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Briefcase, 
  Calendar, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Loader2, 
  Upload, 
  Eye, 
  Play,
  Star
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ExperienceAdmin: React.FC = () => {
  const [experiences, setExperiences] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    company: '',
    role: '',
    description: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    technologies: [] as string[],
    workplaceType: 'Company',
    type: 'Full-time',
    workSamples: [] as any[]
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingSamples, setUploadingSamples] = useState(false);

  useEffect(() => {
    fetchExperiences();
  }, []);

  const fetchExperiences = async () => {
    try {
      const response = await api.get('/experience');
      setExperiences(response.data);
    } catch (error) {
      toast.error('Failed to fetch experiences');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
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

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      description: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      technologies: [],
      workplaceType: 'Company',
      type: 'Full-time',
      workSamples: []
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      description: exp.description || '',
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '',
      isCurrent: exp.isCurrent,
      technologies: exp.technologies || [],
      workplaceType: exp.workplaceType || 'Company',
      type: exp.type || 'Full-time',
      workSamples: exp.workSamples || []
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const handleSampleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!editingExp?._id && !formData._id) {
      toast.error('Protocol Error: Save experience parameters first');
      return;
    }

    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingSamples(true);
    setUploadProgress(0);

    try {
      const expId = editingExp?._id || formData._id;
      const uploadData = new FormData();
      Array.from(files).forEach(file => {
        uploadData.append('samples', file);
      });

      const response = await api.post(`/experience/${expId}/samples`, uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 100));
          setUploadProgress(percentCompleted);
        }
      });

      setFormData((prev: any) => ({
        ...prev,
        workSamples: response.data.workSamples
      }));
      toast.success('Evidence Assets Synced');
      fetchExperiences();
    } catch (error) {
      toast.error('Upload Interrupted');
    } finally {
      setUploadingSamples(false);
      setUploadProgress(0);
    }
  };

  const deleteSample = async (sampleId: string) => {
    try {
      const expId = editingExp?._id || formData._id;
      await api.delete(`/experience/${expId}/samples/${sampleId}`);
      setFormData((prev: any) => ({
        ...prev,
        workSamples: prev.workSamples.filter((s: any) => s._id !== sampleId)
      }));
      toast.success('Asset Purged');
      fetchExperiences();
    } catch (error) {
      toast.error('Deactivation Failed');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'technologies' || key === 'workSamples') {
          data.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      
      if (logo) {
        data.append('logo', logo);
      }

      if (editingExp) {
        await api.put(`/experience/${editingExp._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Experience Node Optimized');
      } else {
        const response = await api.post('/experience', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Node Initialized. Sync Evidence Now.');
        setEditingExp(response.data);
        setFormData((prev: any) => ({...prev, _id: response.data._id}));
      }
      
      fetchExperiences();
    } catch (error: any) {
      toast.error('Sync Error: Node Modification Failed');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Deactivate this career node permanently?')) {
      try {
        await api.delete(`/experience/${id}`);
        toast.success('Node Deactivated');
        fetchExperiences();
      } catch (error) {
        toast.error('Termination Failed');
      }
    }
  };

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
              <Briefcase size={16} className="text-accent-cyan" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-cyan">Career Ledger</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">
              Manage <span className="text-gradient">Experience</span>
            </h1>
            <p className="mt-4 text-text-muted font-medium tracking-wide text-base md:text-lg opacity-80 uppercase text-[11px] tracking-[0.2em]">Document your professional trajectory and milestones.</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="group relative px-10 py-5 bg-gradient-primary rounded-[32px] font-black text-[11px] uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow-violet"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <Plus size={20} /> Initialize Career Node
            </span>
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent-violet" size={48} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {experiences.sort((a, b) => b.order - a.order).map((exp, i) => (
              <motion.div 
                key={exp._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 15 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-cyan/20 to-accent-violet/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
                
                <div className="relative glass-card glass-card-hover p-10 md:p-12 rounded-[40px] flex flex-col xl:flex-row items-center justify-between gap-10 group shadow-2xl bg-[#0A0A12]/60">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                      <div className="w-24 h-24 glass rounded-[32px] flex items-center justify-center text-accent-cyan border border-white/5 overflow-hidden bg-bg-surface/50 transition-all duration-500 group-hover:scale-105 group-hover:border-accent-cyan/30">
                        {exp.logo ? (
                          <img src={exp.logo} alt="" className="w-full h-full object-contain p-4" />
                        ) : (
                          <Briefcase size={40} />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow-violet border border-white/10">
                        <Star size={12} fill="white" />
                      </div>
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <h3 className="font-display font-black text-3xl text-text-primary tracking-tighter">{exp.role}</h3>
                        <span className="px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20">
                          {exp.workplaceType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <p className="text-xl font-bold text-gradient-aurora tracking-tight">{exp.company}</p>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="flex items-center gap-2 text-text-muted font-black uppercase tracking-[0.2em] text-[10px]">
                          <Calendar size={14} className="text-accent-violet" />
                          {new Date(exp.startDate).getFullYear()} — {exp.isCurrent ? 'Present' : new Date(exp.endDate!).getFullYear()}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => openEditModal(exp)} className="flex-grow xl:flex-grow-0 w-16 h-16 glass rounded-2xl flex items-center justify-center text-text-primary hover:bg-white hover:text-bg-base transition-all shadow-2xl border border-white/10 hover:scale-110 active:scale-95 group/btn">
                      <Edit2 size={24} />
                    </button>
                    <button onClick={() => handleDelete(exp._id)} className="flex-grow xl:flex-grow-0 w-16 h-16 glass rounded-2xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-2xl border border-white/10 hover:scale-110 active:scale-95 group/btn">
                      <Trash2 size={24} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-bg-base/95 backdrop-blur-2xl" 
              onClick={() => setIsModalOpen(false)} 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass rounded-[48px] w-full max-w-5xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent-cyan shadow-glow-cyan animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-cyan">Career Integration</span>
                  </div>
                  <h2 className="text-4xl font-display font-black text-text-primary tracking-tighter">
                    {editingExp ? 'Modify' : 'Initialize'} <span className="text-gradient">Experience</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 md:p-14 overflow-y-auto scrollbar-hide">
                <form onSubmit={handleSubmit} className="space-y-12">
                  <div className="grid md:grid-cols-2 gap-12">
                    <div className="space-y-10">
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Organization</label>
                          <input name="company" value={formData.company} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 focus:bg-white/[0.05] transition-all font-medium" />
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Emblem</label>
                          <div className="relative group glass bg-white/[0.03] border border-dashed border-white/10 rounded-2xl h-[66px] flex items-center justify-center hover:border-accent-cyan/40 transition-all">
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{logo ? logo.name : 'Log Brand Asset'}</span>
                            <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Position Title</label>
                        <input name="role" value={formData.role} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-medium" />
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Environment</label>
                          <select name="workplaceType" value={formData.workplaceType} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-black appearance-none cursor-pointer uppercase text-[10px] tracking-widest">
                            {['Company', 'Business', 'Freelance', 'Remote', 'Own Business', 'NGO', 'Government', 'Other'].map(type => (
                              <option key={type} value={type} className="bg-[#0A0A12] text-text-primary">{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Structural Type</label>
                          <select name="type" value={formData.type} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-black appearance-none cursor-pointer uppercase text-[10px] tracking-widest">
                             <option value="Full-time" className="bg-[#0A0A12] text-text-primary">Full-time Node</option>
                            <option value="Part-time" className="bg-[#0A0A12] text-text-primary">Part-time Node</option>
                            <option value="Freelance" className="bg-[#0A0A12] text-text-primary">Contract Flow</option>
                            <option value="Internship" className="bg-[#0A0A12] text-text-primary">Learning Core</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Initiation</label>
                          <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-medium" />
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Termination</label>
                          <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} disabled={formData.isCurrent} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-medium disabled:opacity-20" />
                        </div>
                      </div>

                      <div className="p-8 glass bg-accent-cyan/[0.03] border border-white/5 rounded-[32px] flex items-center justify-between">
                        <div>
                          <p className="text-[12px] font-black text-text-primary uppercase tracking-widest mb-1">Active Deployment</p>
                          <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Presently operational at this node</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleInputChange} className="sr-only peer" />
                          <div className="w-16 h-9 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-primary shadow-2xl"></div>
                        </label>
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Mission Parameters</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5} className="w-full glass bg-white/[0.03] border border-white/5 rounded-[32px] p-8 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-medium leading-relaxed" />
                      </div>

                      <div className="space-y-6">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Capability Stack</label>
                        <div className="flex gap-4">
                          <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-grow glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-cyan/50 transition-all font-medium" placeholder="Add Tech..." />
                          <button type="button" onClick={addTech} className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-all"><Plus size={28} /></button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {formData.technologies.map((tech: string) => (
                            <span key={tech} className="tech-badge">
                              <div className="w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-glow-cyan" />
                              {tech}
                              <X size={16} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors ml-2" onClick={() => removeTech(tech)} />
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4 mb-8">
                          <Eye size={24} className="text-accent-violet" />
                          <h3 className="text-2xl font-black text-text-primary tracking-tighter">Evidence Repository</h3>
                        </div>
                        {!editingExp && !formData._id ? (
                          <div className="p-10 glass rounded-[32px] border border-white/5 text-center bg-white/[0.01]">
                            <p className="text-[10px] font-black text-text-muted uppercase tracking-widest leading-relaxed">Initialize experience protocol first to upload cinematic evidence.</p>
                          </div>
                        ) : (
                          <div className="space-y-10">
                            <div className="relative group aspect-video glass bg-white/[0.03] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-violet/40 transition-all duration-700">
                              <div className="absolute inset-0 bg-gradient-secondary opacity-0 group-hover:opacity-10 transition-opacity" />
                              {uploadingSamples ? (
                                <div className="text-center">
                                  <Loader2 className="animate-spin text-accent-violet mb-4 mx-auto" size={40} />
                                  <p className="text-[10px] font-black text-text-primary uppercase tracking-[0.3em]">Syncing Evidence... {uploadProgress}%</p>
                                </div>
                              ) : (
                                <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                  <Upload className="text-accent-violet mb-4 mx-auto" size={40} />
                                  <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Upload Field Evidence</span>
                                </div>
                              )}
                              <input type="file" multiple accept="image/*,video/*" onChange={handleSampleUpload} disabled={uploadingSamples} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>

                            <div className="grid grid-cols-4 gap-4">
                              {formData.workSamples.map((sample: any) => (
                                <div key={sample._id} className="relative aspect-square rounded-2xl overflow-hidden glass border border-white/5 group/sample">
                                  {sample.type === 'image' ? (
                                    <img src={sample.url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover/sample:scale-110" />
                                  ) : (
                                    <div className="w-full h-full bg-bg-surface flex items-center justify-center text-accent-violet">
                                      <Play size={24} />
                                    </div>
                                  )}
                                  <div className="absolute inset-0 bg-bg-base/80 opacity-0 group-hover/sample:opacity-100 transition-all duration-500 flex items-center justify-center">
                                    <button type="button" onClick={() => deleteSample(sample._id)} className="w-10 h-10 glass rounded-xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-2xl">
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

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full py-6 bg-gradient-primary rounded-[32px] font-black text-base uppercase tracking-widest shadow-glow-violet hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
                    {editingExp ? 'Update Career Node' : 'Initialize Career Node'}
                  </button>
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
