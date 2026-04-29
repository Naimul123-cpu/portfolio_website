import React, { useState } from 'react';
import { Plus, Trash2, Edit2, X, Upload, Save, Loader2, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ProjectsAdmin: React.FC = () => {
  const { projects, refresh } = usePortfolioData();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-accent-violet mb-2">Protocol Initialization</p>
                  <h2 className="text-3xl md:text-4xl font-display font-black text-text-primary tracking-tight">
                    {editingProject ? 'Modify' : 'Launch'} <span className="text-gradient">Project</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 md:w-12 md:h-12 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="p-6 md:p-10 overflow-y-auto scrollbar-hide">
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-8 md:gap-10">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Display Title</label>
                      <input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange}
                        className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet focus:bg-white/10 transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Categorization</label>
                        <input 
                          name="category" 
                          value={formData.category} 
                          onChange={handleInputChange}
                          placeholder="e.g. Structural Design"
                          className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Live Status</label>
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleInputChange}
                          className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-bold appearance-none cursor-pointer"
                        >
                          <option value="completed">Active & Stable</option>
                          <option value="in-progress">Developing</option>
                          <option value="archived">Stored</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Project Abstract</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full glass bg-white/5 border border-white/10 rounded-[24px] md:rounded-[32px] p-6 text-text-primary outline-none focus:border-accent-violet transition-all font-medium leading-relaxed"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Live Deployment</label>
                        <input 
                          name="liveUrl" 
                          value={formData.liveUrl} 
                          onChange={handleInputChange}
                          placeholder="https://..."
                          className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-3">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Source Code</label>
                        <input 
                          name="githubUrl" 
                          value={formData.githubUrl} 
                          onChange={handleInputChange}
                          placeholder="https://github.com/..."
                          className="w-full glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-3">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Project Cover</label>
                      <div className="relative group cursor-pointer aspect-video glass bg-white/5 border border-dashed border-white/20 rounded-[24px] md:rounded-[32px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-violet/50 transition-all duration-500">
                        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        {thumbnail ? (
                          <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : formData.thumbnail ? (
                          <img src={formData.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="text-center group-hover:scale-110 transition-transform duration-500">
                            <Upload className="text-accent-violet mb-4 mx-auto" size={32} />
                            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">Upload Cover</span>
                          </div>
                        )}
                        <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.2em] ml-2">Engineering Toolkit</label>
                      <div className="flex gap-3">
                        <input 
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                          className="flex-grow glass bg-white/5 border border-white/10 rounded-2xl p-4 text-text-primary outline-none focus:border-accent-violet transition-all font-medium"
                          placeholder="Add capability..."
                        />
                        <button type="button" onClick={addTech} className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-110 transition-all active:scale-95">
                          <Plus size={24} />
                        </button>
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

                    <div className="p-6 glass bg-accent-violet/5 border border-white/10 rounded-[24px] md:rounded-[32px] flex items-center justify-between">
                      <div>
                        <p className="text-[11px] font-black text-text-primary uppercase tracking-widest mb-1">Highlight Project</p>
                        <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Featured on main gallery</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="featured" 
                          checked={formData.featured} 
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-primary shadow-inner"></div>
                      </label>
                    </div>

                    <GlowButton type="submit" disabled={isSaving} size="lg" className="w-full py-5 shadow-glow-violet">
                      {isSaving ? <Loader2 className="animate-spin mr-2" size={24} /> : <Save className="mr-2" size={24} />}
                      <span className="font-black text-base">{editingProject ? 'UPDATE ARCHITECTURE' : 'INITIALIZE PROJECT'}</span>
                    </GlowButton>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectsAdmin;
