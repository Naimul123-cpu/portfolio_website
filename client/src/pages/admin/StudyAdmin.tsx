import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Loader2, GraduationCap, Calendar } from 'lucide-react';
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
    <div className="flex bg-bg-primary min-h-screen">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-bold text-gradient">Education Management</h1>
        <GlowButton onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={18} /> Add New Entry
        </GlowButton>
      </div>

      <div className="space-y-4">
        {studies.sort((a, b) => b.order - a.order).map((study) => (
          <div key={study._id} className="glass-card p-6 flex items-center justify-between group hover:border-accent-violet/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 glass rounded-xl flex items-center justify-center text-accent-violet overflow-hidden">
                {study.logo ? (
                  <img src={study.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <GraduationCap size={32} />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-xl">{study.degree}</h3>
                  <span className="badge bg-accent-violet/10 text-accent-violet border border-accent-violet/20">{study.institutionType}</span>
                </div>
                <p className="text-accent-violet font-medium">{study.institution}</p>
                <div className="flex items-center gap-4 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {study.startYear} - {study.endYear || 'Present'}</span>
                  {study.grade && <span className="px-2 py-0.5 rounded bg-white/5 uppercase border border-white/10">GPA: {study.grade}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(study)} className="p-3 bg-white/5 hover:bg-accent-violet hover:text-white rounded-xl transition-all">
                <Edit2 size={20} />
              </button>
              <button onClick={() => handleDelete(study._id)} className="p-3 bg-white/5 hover:bg-accent-cyan hover:text-white rounded-xl transition-all">
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border-accent-violet/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">
                {editingStudy ? 'Edit Education' : 'Add Education'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:text-accent-cyan transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Institution</label>
                  <input name="institution" value={formData.institution} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Institution Type</label>
                  <select name="institutionType" value={formData.institutionType} onChange={handleInputChange} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet">
                    {['School', 'College', 'University', 'Online Course', 'Training Institute', 'Certification', 'Other'].map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Degree</label>
                  <input name="degree" value={formData.degree} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Logo</label>
                  <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent-violet file:text-white file:cursor-pointer" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Subjects / Major</label>
                <div className="flex gap-2 mb-3">
                  <input value={subjectInput} onChange={(e) => setSubjectInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSubject())} className="flex-grow bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" placeholder="Computer Science, Physics..." />
                  <button type="button" onClick={addSubject} className="p-3 bg-accent-violet rounded-xl text-white"><Plus size={24} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.subjects.map((sub: string) => (
                    <span key={sub} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-sm border border-white/10">
                      {sub}
                      <X size={14} className="cursor-pointer text-accent-cyan" onClick={() => removeSubject(sub)} />
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Start Year</label>
                  <input type="number" name="startYear" value={formData.startYear} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">End Year</label>
                  <input type="number" name="endYear" value={formData.endYear} onChange={handleInputChange} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">GPA / Grade</label>
                  <input name="grade" value={formData.grade} onChange={handleInputChange} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-violet" />
              </div>

              <GlowButton type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                {editingStudy ? 'Update Entry' : 'Create Entry'}
              </GlowButton>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default StudyAdmin;
