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
  ArrowRight
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';
import GlowButton from '../../components/ui/GlowButton';

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
        toast.success('Academic node updated');
      } else {
        await api.post('/study', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Academic node created');
      }
      
      setIsModalOpen(false);
      fetchStudies();
    } catch (error) {
      toast.error('Failed to save study');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/study/${id}`);
        toast.success('Record deleted');
        fetchStudies();
      } catch (error) {
        toast.error('Failed to delete record');
      }
    }
  };

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
              <GraduationCap size={24} />
            </button>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent-violet border border-white/10">
                  Academic Ledger
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tight">
                Educational <span className="text-gradient bg-gradient-aurora">Timeline</span>
              </h1>
              <p className="mt-4 text-text-secondary font-medium tracking-wide text-lg">Document your intellectual growth and certifications.</p>
            </div>
          </div>
          <GlowButton onClick={openAddModal} className="flex items-center gap-3 px-10 py-4 shadow-glow-violet">
            <Plus size={20} />
            <span className="font-black">ADD ACADEMIC NODE</span>
          </GlowButton>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent-violet" size={48} />
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-8">
          {studies.sort((a, b) => b.order - a.order).map((study, i) => (
            <motion.div 
              key={study._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5, scale: 1.01 }}
              className="group relative"
            >
              {/* Card Glow Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-accent-violet to-accent-blue rounded-[32px] opacity-0 group-hover:opacity-20 blur-xl transition-all duration-700" />
              
              <div className="relative glass p-8 rounded-[32px] flex flex-col md:flex-row items-start md:items-center justify-between gap-8 border border-white/5 bg-white/[0.02] shadow-2xl overflow-hidden group-hover:border-white/20 transition-all duration-500">
                {/* Tech Grid Background */}
                <div className="absolute inset-0 bg-grid-white/[0.02] opacity-20 pointer-events-none" />
                
                <div className="flex items-center gap-8 relative z-10">
                  <div className="relative">
                    <div className="w-24 h-24 glass rounded-2xl flex items-center justify-center text-accent-violet border border-white/10 overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.1)] group-hover:shadow-[0_0_50px_rgba(139,92,246,0.3)] transition-all duration-500 bg-bg-surface/50">
                      {study.logo ? (
                        <img src={study.logo} alt="" className="w-full h-full object-contain p-3 transition-transform duration-500 group-hover:scale-110" />
                      ) : (
                        <GraduationCap size={40} className="group-hover:scale-110 transition-transform duration-500" />
                      )}
                    </div>
                    {/* Floating Level Indicator */}
                    <div className="absolute -top-3 -left-3 px-3 py-1 glass rounded-lg border border-white/10 text-[8px] font-black text-accent-blue uppercase tracking-widest shadow-xl">
                      LVL. {study.startYear.toString().slice(-2)}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-4">
                      <h3 className="font-display font-black text-3xl text-text-primary tracking-tight group-hover:text-gradient transition-all duration-500">
                        {study.degree}
                      </h3>
                      <span className="px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.2em] bg-accent-violet/10 text-accent-violet border border-accent-violet/20 shadow-inner">
                        {study.institutionType}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <p className="text-xl font-bold text-text-secondary opacity-80">{study.institution}</p>
                      <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse" />
                    </div>

                    <div className="flex flex-wrap items-center gap-6">
                      <div className="flex items-center gap-3 glass border-white/5 px-4 py-2 rounded-xl">
                        <Calendar size={16} className="text-accent-violet" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                          {study.startYear} <ArrowRight size={10} className="inline mx-1 opacity-50" /> {study.endYear || 'PRESENT'}
                        </span>
                      </div>
                      
                      {study.grade && (
                        <div className="flex items-center gap-3 glass border-white/5 px-4 py-2 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-accent-blue shadow-glow-blue" />
                          <span className="text-[10px] font-black uppercase tracking-widest text-text-primary">
                            PERFORMANCE: <span className="text-accent-blue">{study.grade}</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 relative z-10 w-full md:w-auto">
                  <button 
                    onClick={() => openEditModal(study)} 
                    className="flex-grow md:flex-grow-0 w-14 h-14 glass rounded-2xl flex items-center justify-center text-text-primary hover:bg-accent-violet hover:text-white transition-all shadow-xl border border-white/10 hover:scale-110 active:scale-95 group/btn"
                  >
                    <Edit2 size={22} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                  <button 
                    onClick={() => handleDelete(study._id)} 
                    className="flex-grow md:flex-grow-0 w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-xl border border-white/10 hover:scale-110 active:scale-95 group/btn"
                  >
                    <Trash2 size={22} className="group-hover/btn:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        )}
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
              className="relative glass rounded-[32px] md:rounded-[48px] w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-glow-violet border border-white/10 flex flex-col"
            >
              <div className="p-6 md:p-10 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-violet mb-2">Academic Protocol</p>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">
                    {editingStudy ? 'Update' : 'Register'} <span className="text-gradient">Knowledge</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto scrollbar-hide">
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Institution Name</label>
                      <input name="institution" value={formData.institution} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Entity Type</label>
                      <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-bold appearance-none cursor-pointer">
                        {['School', 'College', 'University', 'Online Course', 'Training Institute', 'Certification', 'Other'].map(type => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Degree / Qualification</label>
                      <input name="degree" value={formData.degree} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Institution Emblem</label>
                      <div className="relative group glass bg-white/5 border border-dashed border-white/20 rounded-2xl h-[58px] flex items-center justify-center hover:border-accent-violet/50 transition-all">
                        <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{logo ? logo.name : 'Upload Symbol'}</span>
                        <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Curriculum Pillars</label>
                    <div className="flex gap-4 mb-4">
                      <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())} className="flex-grow glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" placeholder="Add major subject..." />
                      <button type="button" onClick={addSubject} className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-110 transition-all"><Plus size={24} /></button>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {formData.subjects.map((sub: string) => {
                        const cleanSub = typeof sub === 'string' ? sub.replace(/[\[\]"]/g, '') : sub;
                        if (!cleanSub) return null;
                        return (
                          <span key={sub} className="flex items-center gap-3 px-5 py-2.5 glass rounded-2xl border-white/5 text-[11px] font-black text-text-primary uppercase tracking-widest group">
                            {cleanSub}
                            <X size={14} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors" onClick={() => removeSubject(sub)} />
                          </span>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Start Cycle</label>
                      <input type="number" name="startYear" value={formData.startYear} onChange={handleInputChange} required className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">End Cycle</label>
                      <input type="number" name="endYear" value={formData.endYear} onChange={handleInputChange} className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Performance</label>
                      <input name="grade" value={formData.grade} onChange={handleInputChange} placeholder="GPA / Grade" className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Contextual Notes</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full glass bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-6 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
                  </div>

                  <GlowButton type="submit" disabled={isSaving} size="lg" className="w-full py-5 shadow-glow-violet">
                    {isSaving ? <Loader2 className="animate-spin mr-2" size={24} /> : <Save className="mr-2" size={24} />}
                    <span className="font-black text-base">{editingStudy ? 'SYNC NODE' : 'INITIALIZE NODE'}</span>
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

export default StudyAdmin;
