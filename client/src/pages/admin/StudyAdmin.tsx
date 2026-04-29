import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  GraduationCap, 
  Calendar, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Loader2,
  BookOpen,
  Zap
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const StudyAdmin: React.FC = () => {
  const [studies, setStudies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [formData, setFormData] = useState<any>({
    institution: '',
    degree: '',
    field: '',
    description: '',
    startYear: new Date().getFullYear(),
    endYear: '',
    grade: '',
    subjects: [] as string[],
    institutionType: 'University'
  });

  const [logo, setLogo] = useState<File | null>(null);
  const [subjectInput, setSubjectInput] = useState('');

  useEffect(() => {
    fetchStudies();
  }, []);

  const fetchStudies = async () => {
    try {
      const response = await api.get('/study');
      setStudies(response.data);
    } catch (error) {
      toast.error('Failed to fetch studies');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value
    }));
  };

  const addSubject = () => {
    if (subjectInput.trim() && !formData.subjects.includes(subjectInput.trim())) {
      setFormData((prev: any) => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput.trim()]
      }));
      setSubjectInput('');
    }
  };

  const removeSubject = (subject: string) => {
    setFormData((prev: any) => ({
      ...prev,
      subjects: prev.subjects.filter((s: string) => s !== subject)
    }));
  };

  const openAddModal = () => {
    setEditingStudy(null);
    setFormData({
      institution: '',
      degree: '',
      description: '',
      startYear: new Date().getFullYear(),
      endYear: '',
      grade: '',
      subjects: [],
      institutionType: 'University'
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (study: any) => {
    setEditingStudy(study);
    setFormData({
      institution: study.institution,
      degree: study.degree,
      field: study.field || '',
      description: study.description || '',
      startYear: study.startYear,
      endYear: study.endYear || '',
      grade: study.grade || '',
      subjects: study.subjects || [],
      institutionType: study.institutionType || 'University'
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'subjects') {
          data.append(key, JSON.stringify(value));
        } else if (value !== null && value !== undefined) {
          data.append(key, value.toString());
        }
      });
      
      if (logo) {
        data.append('logo', logo);
      }

      if (editingStudy) {
        await api.put(`/study/${editingStudy._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Academic Node Synchronized');
      } else {
        await api.post('/study', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Academic Node Initialized');
      }
      
      setIsModalOpen(false);
      fetchStudies();
    } catch (error) {
      toast.error('Sync Protocol Failure');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Terminate this academic record permanently?')) {
      try {
        await api.delete(`/study/${id}`);
        toast.success('Record Deactivated');
        fetchStudies();
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

      <main className="flex-grow lg:ml-80 p-8 md:p-14 relative z-10 overflow-y-auto max-h-screen scrollbar-hide">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <GraduationCap size={16} className="text-accent-pink" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-pink">Academic Ledger</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">
              Educational <span className="text-gradient">Timeline</span>
            </h1>
            <p className="mt-4 text-text-muted font-medium tracking-wide text-lg opacity-80 uppercase text-[11px] tracking-[0.2em]">Document your intellectual growth and certifications.</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="group relative px-10 py-5 bg-gradient-primary rounded-[32px] font-black text-[11px] uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow-violet"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <Plus size={20} /> Initialize Academic Node
            </span>
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent-violet" size={48} />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto space-y-10">
            {studies.sort((a, b) => b.order - a.order).map((study, i) => (
              <motion.div 
                key={study._id}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ x: 15 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-r from-accent-pink/20 to-accent-violet/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-700" />
                
                <div className="relative glass-card glass-card-hover p-10 md:p-12 rounded-[40px] flex flex-col xl:flex-row items-center justify-between gap-10 group shadow-2xl bg-[#0A0A12]/60">
                  <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="relative">
                      <div className="w-24 h-24 glass rounded-[32px] flex items-center justify-center text-accent-pink border border-white/5 overflow-hidden bg-bg-surface/50 transition-all duration-500 group-hover:scale-105 group-hover:border-accent-pink/30">
                        {study.logo ? (
                          <img src={study.logo} alt="" className="w-full h-full object-contain p-4" />
                        ) : (
                          <BookOpen size={40} />
                        )}
                      </div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow-violet border border-white/10">
                        <Zap size={12} fill="white" />
                      </div>
                    </div>

                    <div className="space-y-4 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        <h3 className="font-display font-black text-3xl text-text-primary tracking-tighter">{study.degree}</h3>
                        <span className="px-4 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent-pink/10 text-accent-pink border border-accent-pink/20">
                          {study.institutionType}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                        <p className="text-xl font-bold text-gradient-aurora tracking-tight">{study.institution}</p>
                        <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/10" />
                        <div className="flex items-center gap-2 text-text-muted font-black uppercase tracking-[0.2em] text-[10px]">
                          <Calendar size={14} className="text-accent-violet" />
                          {study.startYear} — {study.endYear || 'PRESENT'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-4 w-full xl:w-auto">
                    <button onClick={() => openEditModal(study)} className="flex-grow xl:flex-grow-0 w-16 h-16 glass rounded-2xl flex items-center justify-center text-text-primary hover:bg-white hover:text-bg-base transition-all shadow-2xl border border-white/10 hover:scale-110 active:scale-95 group/btn">
                      <Edit2 size={24} />
                    </button>
                    <button onClick={() => handleDelete(study._id)} className="flex-grow xl:flex-grow-0 w-16 h-16 glass rounded-2xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-2xl border border-white/10 hover:scale-110 active:scale-95 group/btn">
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
              className="relative glass rounded-[48px] w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl border border-white/10 flex flex-col"
            >
              <div className="p-10 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-accent-pink shadow-glow-pink animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-pink">Knowledge Integration</span>
                  </div>
                  <h2 className="text-4xl font-display font-black text-text-primary tracking-tighter">
                    {editingStudy ? 'Update' : 'Initialize'} <span className="text-gradient">Knowledge</span>
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
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Institution Name</label>
                        <input name="institution" value={formData.institution} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-pink/50 focus:bg-white/[0.05] transition-all font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Entity Type</label>
                          <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-black appearance-none cursor-pointer uppercase text-[10px] tracking-widest">
                            {['School', 'College', 'University', 'Online Course', 'Training Institute', 'Certification', 'Other'].map(type => (
                              <option key={type} value={type} className="bg-[#0A0A12] text-text-primary">{type}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Symbol Asset</label>
                          <div className="relative group glass bg-white/[0.03] border border-dashed border-white/10 rounded-2xl h-[66px] flex items-center justify-center hover:border-accent-pink/40 transition-all">
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">{logo ? logo.name : 'Upload Symbol'}</span>
                            <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Degree / Qualification</label>
                        <input name="degree" value={formData.degree} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Major / Field of Study</label>
                        <input name="field" value={formData.field} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" placeholder="e.g. Science, Engineering, Arts..." />
                      </div>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-6">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Curriculum Pillars</label>
                        <div className="flex gap-4">
                          <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())} className="flex-grow glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" placeholder="Add Major Subject..." />
                          <button type="button" onClick={addSubject} className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-all"><Plus size={28} /></button>
                        </div>
                        <div className="flex flex-wrap gap-3">
                          {formData.subjects.map((sub: string) => {
                            const cleanSub = typeof sub === 'string' ? sub.replace(/[\[\]"]/g, '') : sub;
                            return (
                              <span key={sub} className="tech-badge">
                                <div className="w-1.5 h-1.5 rounded-full bg-accent-pink shadow-glow-pink" />
                                {cleanSub}
                                <X size={16} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors ml-2" onClick={() => removeSubject(sub)} />
                              </span>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-6">
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Initiation</label>
                          <input type="number" name="startYear" value={formData.startYear} onChange={handleInputChange} required className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-4 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" />
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Completion</label>
                          <input type="number" name="endYear" value={formData.endYear} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-4 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" />
                        </div>
                        <div className="space-y-4">
                          <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">GPA</label>
                          <input name="grade" value={formData.grade} onChange={handleInputChange} className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-4 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium" />
                        </div>
                      </div>

                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Contextual Notes</label>
                        <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full glass bg-white/[0.03] border border-white/5 rounded-[32px] p-8 text-text-primary outline-none focus:border-accent-pink/50 transition-all font-medium leading-relaxed" />
                      </div>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full py-6 bg-gradient-primary rounded-[32px] font-black text-base uppercase tracking-widest shadow-glow-violet hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                  >
                    {isSaving ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
                    {editingStudy ? 'Sync Academic Node' : 'Initialize Academic Node'}
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

export default StudyAdmin;
