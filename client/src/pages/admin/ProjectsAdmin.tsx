import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Upload, Save, Loader2 } from 'lucide-react';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';

const ProjectsAdmin: React.FC = () => {
  const { projects, refresh } = usePortfolioData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [formData, setFormData] = useState<any>({
    title: '',
    description: '',
    category: '',
    technologies: [],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'completed'
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      category: '',
      technologies: [],
      liveUrl: '',
      githubUrl: '',
      featured: false,
      status: 'completed'
    });
    setThumbnail(null);
    setIsModalOpen(true);
  };

  const openEditModal = (project: any) => {
    setEditingProject(project);
    setFormData({ ...project });
    setThumbnail(null);
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
        } else if (key !== '_id' && key !== '__v' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'thumbnail') {
          data.append(key, formData[key]);
        }
      });

      if (thumbnail) data.append('thumbnail', thumbnail);

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated!');
      } else {
        await api.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project added!');
      }
      
      setIsModalOpen(false);
      refresh();
    } catch (error: any) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Project deleted');
        refresh();
      } catch (error) {
        toast.error('Failed to delete project');
      }
    }
  };

  return (
    <div className="ml-64 p-10 bg-bg-primary min-h-screen relative">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-display font-bold text-gradient">Manage Projects</h1>
        <GlowButton onClick={openAddModal} className="flex items-center gap-2">
          <Plus size={18} /> Add New Project
        </GlowButton>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.sort((a, b) => b.order - a.order).map((project) => (
          <div key={project._id} className="glass-card overflow-hidden group border border-white/5 hover:border-accent-primary/30 transition-all">
            <div className="relative aspect-video">
              <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                <button 
                  onClick={() => openEditModal(project)}
                  className="p-3 bg-accent-primary rounded-full hover:scale-110 transition-transform"
                >
                  <Edit2 size={20} />
                </button>
                <button 
                  onClick={() => handleDelete(project._id)}
                  className="p-3 bg-accent-tertiary rounded-full hover:scale-110 transition-transform"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {project.featured && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-accent-primary text-[10px] font-bold rounded uppercase">Featured</div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-bold mb-1 truncate">{project.title}</h3>
              <div className="flex justify-between items-center">
                <p className="text-xs text-text-secondary uppercase tracking-widest">{project.category}</p>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 border border-white/10">{project.status}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-bg-primary/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl border-accent-primary/20">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-display font-bold">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:text-accent-tertiary transition-colors">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Project Title</label>
                  <input 
                    name="title" 
                    value={formData.title} 
                    onChange={handleInputChange}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Category</label>
                  <input 
                    name="category" 
                    value={formData.category} 
                    onChange={handleInputChange}
                    placeholder="Web App, Mobile, UI/UX..."
                    className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Short Description</label>
                  <textarea 
                    name="description" 
                    value={formData.description} 
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Live URL</label>
                    <input 
                      name="liveUrl" 
                      value={formData.liveUrl} 
                      onChange={handleInputChange}
                      className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Github URL</label>
                    <input 
                      name="githubUrl" 
                      value={formData.githubUrl} 
                      onChange={handleInputChange}
                      className="w-full bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Thumbnail</label>
                  <div className="relative group cursor-pointer h-40 bg-bg-primary border border-dashed border-white/20 rounded-2xl flex flex-col items-center justify-center overflow-hidden">
                    {thumbnail ? (
                      <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover" />
                    ) : formData.thumbnail ? (
                      <img src={formData.thumbnail} className="w-full h-full object-cover" />
                    ) : (
                      <>
                        <Upload className="text-text-secondary mb-2" />
                        <span className="text-xs text-text-secondary">Upload Image</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                      className="absolute inset-0 opacity-0 cursor-pointer" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-text-secondary uppercase mb-2">Technologies</label>
                  <div className="flex gap-2 mb-3">
                    <input 
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                      className="flex-grow bg-bg-primary border border-white/10 rounded-xl p-3 outline-none focus:border-accent-primary"
                      placeholder="React, Tailwind..."
                    />
                    <button type="button" onClick={addTech} className="p-3 bg-accent-primary rounded-xl">
                      <Plus size={24} />
                    </button>
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

                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      name="featured" 
                      checked={formData.featured} 
                      onChange={handleInputChange}
                      className="w-5 h-5 rounded border-white/10 bg-bg-primary text-accent-primary focus:ring-accent-primary"
                    />
                    <span className="text-sm font-bold text-text-secondary uppercase group-hover:text-text-primary transition-colors">Featured</span>
                  </label>

                  <select 
                    name="status" 
                    value={formData.status} 
                    onChange={handleInputChange}
                    className="bg-bg-primary border border-white/10 rounded-xl p-2 text-sm outline-none"
                  >
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <GlowButton type="submit" disabled={isSaving} className="w-full flex items-center justify-center gap-2 mt-4">
                  {isSaving ? <Loader2 className="animate-spin" /> : <Save />}
                  {editingProject ? 'Update Project' : 'Create Project'}
                </GlowButton>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsAdmin;
