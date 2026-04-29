import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Loader2, GraduationCap, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const StudyAdmin: React.FC = () => {
  const { studies, refresh } = usePortfolioData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingStudy, setEditingStudy] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    institution: '',
    degree: '',
    field: '',
    institutionType: 'University',
    subjects: [],
    startYear: 2020,
    endYear: 2024,
    grade: '',
    description: '',
    order: 0
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [subjectInput, setSubjectInput] = useState('');

  const openAddModal = () => {
    setEditingStudy(null);
    setFormData({
      institution: '',
      degree: '',
      field: '',
      institutionType: 'University',
      subjects: [],
      startYear: new Date().getFullYear() - 4,
      endYear: new Date().getFullYear(),
      grade: '',
      description: '',
      order: 0
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (study: any) => {
    setEditingStudy(study);
    setFormData({ ...study, subjects: study.subjects || [] });
    setLogo(null);
    setIsModalOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const addSubject = () => {
    if (subjectInput && !formData.subjects.includes(subjectInput)) {
      setFormData((prev: any) => ({
        ...prev,
        subjects: [...prev.subjects, subjectInput]
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'subjects') {
          data.append(key, JSON.stringify(formData[key]));
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'logo') {
          data.append(key, formData[key]);
        }
      });

      if (logo) data.append('logo', logo);

      if (editingStudy) {
        await api.put(`/study/${editingStudy._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Education record updated!');
      } else {
        await api.post('/study', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Education record added!');
      }
      
      setIsModalOpen(false);
      refresh();
    } catch (error: any) {
      toast.error('Failed to save record');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this record?')) {
      try {
        await api.delete(`/study/${id}`);
        toast.success('Record deleted');
        refresh();
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

      <AdminSidebar />

      <main className="flex-grow ml-72 p-12 relative z-10 overflow-y-auto max-h-screen scrollbar-hide">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent-violet border border-white/10">
                Academic Ledger
              </span>
            </div>
            <h1 className="text-5xl font-display font-black text-text-primary tracking-tight">
              Educational <span className="text-gradient bg-gradient-aurora">Timeline</span>
            </h1>
            <p className="mt-4 text-text-secondary font-medium tracking-wide text-lg">Document your intellectual growth and certifications.</p>
          </div>
          <GlowButton onClick={openAddModal} className="flex items-center gap-3 px-10 py-4 shadow-glow-violet">
            <Plus size={20} />
            <span className="font-black">ADD ACADEMIC NODE</span>
          </GlowButton>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          {studies.sort((a, b) => b.order - a.order).map((study, i) => (
            <motion.div 
              key={study._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ x: 10 }}
              className="glass p-8 rounded-[32px] flex items-center justify-between group border border-white/5 hover:border-accent-violet/30 transition-all duration-500 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-primary opacity-30" />
              <div className="flex items-center gap-8">
                <div className="w-20 h-20 glass rounded-2xl flex items-center justify-center text-accent-violet border border-white/10 overflow-hidden shadow-lg relative bg-white/[0.03]">
                  {study.logo ? (
                    <img src={study.logo} alt="" className="w-full h-full object-contain p-2" />
                  ) : (
                    <GraduationCap size={36} />
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h3 className="font-black text-2xl text-text-primary tracking-tight">{study.degree}</h3>
                    <span className="px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-accent-violet/10 text-accent-violet border border-accent-violet/20">{study.institutionType}</span>
                  </div>
                  <p className="text-gradient font-bold text-lg mb-3">{study.institution}</p>
                  <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-text-muted">
                    <span className="flex items-center gap-2"><Calendar size={14} className="text-accent-violet" /> {study.startYear} — {study.endYear || 'Present'}</span>
                    {study.grade && <span className="px-3 py-1 glass rounded-lg border border-white/10">PERFORMANCE: {study.grade}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button onClick={() => openEditModal(study)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-primary hover:bg-accent-violet hover:text-white transition-all shadow-xl border-white/10">
                  <Edit2 size={20} />
                </button>
                <button onClick={() => handleDelete(study._id)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-xl border-white/10">
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-8">
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
                className="relative glass rounded-[48px] w-full max-w-3xl max-h-[85vh] overflow-hidden shadow-glow-violet border border-white/10 flex flex-col"
              >
                <div className="p-10 border-b border-white/10 flex justify-between items-center bg-white/[0.02]">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-violet mb-2">Academic Protocol</p>
                    <h2 className="text-4xl font-display font-black text-text-primary tracking-tight">
                      {editingStudy ? 'Update' : 'Register'} <span className="text-gradient">Knowledge</span>
                    </h2>
                  </div>
                  <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                    <X size={24} />
                  </button>
                </div>

                <div className="p-10 overflow-y-auto scrollbar-hide">
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
                        {formData.subjects.map((sub: string) => (
                          <span key={sub} className="flex items-center gap-3 px-5 py-2.5 glass rounded-2xl border-white/5 text-[11px] font-black text-text-primary uppercase tracking-widest">
                            {sub}
                            <X size={14} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors" onClick={() => removeSubject(sub)} />
                          </span>
                        ))}
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
                      <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full glass bg-white/5 border border-white/10 rounded-[32px] p-6 text-text-primary outline-none focus:border-accent-violet transition-all font-medium" />
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
      </main>
    </div>
  );
};

export default StudyAdmin;
