import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Save, Loader2, Briefcase, Calendar } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ExperienceAdmin: React.FC = () => {
  const { experiences, refresh } = usePortfolioData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingExp, setEditingExp] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    company: '',
    role: '',
    type: 'Full-time',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: '',
    technologies: [],
    order: 0
  });
  const [logo, setLogo] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');

  const openAddModal = () => {
    setEditingExp(null);
    setFormData({
      company: '',
      role: '',
      type: 'Full-time',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: '',
      technologies: [],
      order: 0
    });
    setLogo(null);
    setIsModalOpen(true);
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    // Format dates for input field (YYYY-MM-DD)
    const formattedData = {
      ...exp,
      startDate: exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '',
      endDate: exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : ''
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
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'logo') {
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
        await api.post('/experience', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Experience added!');
      }
      
      setIsModalOpen(false);
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
    <div className="flex bg-bg-primary min-h-screen">
      <AdminSidebar />
      <div className="flex-grow ml-64 p-10">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-bold text-gradient">Experience Management</h1>
        <GlowButton onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={18} /> Add New Experience
        </GlowButton>
      </div>

      <div className="space-y-4">
        {experiences.sort((a, b) => b.order - a.order).map((exp) => (
          <div key={exp._id} className="glass-card p-6 flex items-center justify-between group hover:border-accent-secondary/30 transition-all">
            <div className="flex items-center gap-6">
              <div className="w-16 h-16 glass rounded-xl flex items-center justify-center text-accent-secondary overflow-hidden">
                {exp.logo ? (
                  <img src={exp.logo} alt="" className="w-full h-full object-contain" />
                ) : (
                  <Briefcase size={32} />
                )}
              </div>
              <div>
                <h3 className="font-bold text-xl">{exp.role}</h3>
                <div className="flex items-center gap-2">
                  <p className="text-accent-primary font-medium">{exp.company}</p>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10 uppercase">{exp.type}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-text-secondary mt-1">
                  <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(exp.startDate).getFullYear()} - {exp.isCurrent ? 'Present' : exp.endDate ? new Date(exp.endDate).getFullYear() : ''}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditModal(exp)} className="p-3 bg-white/5 hover:bg-accent-secondary hover:text-white rounded-xl transition-all">
                <Edit2 size={20} />
              </button>
              <button onClick={() => handleDelete(exp._id)} className="p-3 bg-white/5 hover:bg-accent-tertiary hover:text-white rounded-xl transition-all">
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
          <div className="relative glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 border-accent-secondary/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">
                {editingExp ? 'Edit Experience' : 'Add Experience'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:text-accent-tertiary transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Company</label>
                  <input name="company" value={formData.company} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Company Logo</label>
                  <input type="file" onChange={(e) => setLogo(e.target.files?.[0] || null)} className="w-full text-sm text-text-secondary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-accent-secondary file:text-white file:cursor-pointer" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Role</label>
                  <input name="role" value={formData.role} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Job Type</label>
                  <select name="type" value={formData.type} onChange={handleInputChange} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Internship">Internship</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Start Date</label>
                  <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} required className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">End Date</label>
                  <input type="date" name="endDate" value={formData.endDate} onChange={handleInputChange} disabled={formData.isCurrent} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary disabled:opacity-50" />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input type="checkbox" name="isCurrent" checked={formData.isCurrent} onChange={handleInputChange} className="w-4 h-4 rounded" />
                <label className="text-sm font-bold text-text-secondary uppercase">I am currently working here</label>
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Description</label>
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={4} className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary" />
              </div>

              <div>
                <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Technologies Used</label>
                <div className="flex gap-2 mb-3">
                  <input value={techInput} onChange={(e) => setTechInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())} className="flex-grow bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-secondary" placeholder="AWS, Docker..." />
                  <button type="button" onClick={addTech} className="p-3 bg-accent-secondary rounded-xl"><Plus size={24} /></button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech: string) => (
                    <span key={tech} className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg text-sm">
                      {tech}
                      <X size={14} className="cursor-pointer text-accent-tertiary" onClick={() => removeTech(tech)} />
                    </span>
                  ))}
                </div>
              </div>

              <GlowButton type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                {editingExp ? 'Update Experience' : 'Create Experience'}
              </GlowButton>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ExperienceAdmin;
