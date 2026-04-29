import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Star,
  Upload,
  X,
  Save,
  Loader2,
  Zap,
  Cpu
} from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import AdminSidebar from '../../components/layout/AdminSidebar';

const ProjectsAdmin: React.FC = () => {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    thumbnail: '',
    category: '',
    technologies: [] as string[],
    liveUrl: '',
    githubUrl: '',
    featured: false,
    status: 'completed'
  });

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/projects');
      setProjects(response.data);
    } catch (error) {
      toast.error('Failed to fetch projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const addTech = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const removeTech = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  const openAddModal = () => {
    setEditingProject(null);
    setFormData({
      title: '',
      description: '',
      thumbnail: '',
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
    setFormData({
      title: project.title,
      description: project.description,
      thumbnail: project.thumbnail,
      category: project.category,
      technologies: project.technologies,
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
      status: project.status
    });
    setThumbnail(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'technologies') {
          data.append(key, JSON.stringify(value));
        } else {
          data.append(key, value.toString());
        }
      });
      
      if (thumbnail) {
        data.append('thumbnail', thumbnail);
      }

      if (editingProject) {
        await api.put(`/projects/${editingProject._id}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project updated successfully');
      } else {
        await api.post('/projects', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        toast.success('Project created successfully');
      }
      
      setIsModalOpen(false);
      fetchProjects();
    } catch (error) {
      toast.error('Failed to save project');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Terminate this project asset permanently?')) {
      try {
        await api.delete(`/projects/${id}`);
        toast.success('Asset deleted successfully');
        fetchProjects();
      } catch (error) {
        toast.error('Failed to delete asset');
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] flex overflow-hidden">
      {/* Aurora Orbs for Admin */}
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
              <Zap size={16} className="text-accent-violet" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-violet">Project Vault</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">
              Manage <span className="text-gradient">Showcase</span>
            </h1>
            <p className="mt-4 text-text-muted font-medium tracking-wide text-base md:text-lg opacity-80 uppercase text-[11px] tracking-[0.2em]">Curate and refine your collection of engineering masterpieces.</p>
          </div>
          <button 
            onClick={openAddModal} 
            className="group relative px-10 py-5 bg-gradient-primary rounded-[32px] font-black text-[11px] uppercase tracking-widest overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-glow-violet"
          >
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
            <span className="relative flex items-center gap-3">
              <Plus size={20} /> Initialize New Project
            </span>
          </button>
        </header>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="animate-spin text-accent-violet" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-12">
            {projects.sort((a, b) => b.order - a.order).map((project, i) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -12 }}
                className="group relative"
              >
                <div className="absolute -inset-1 bg-gradient-to-br from-accent-violet/20 to-accent-cyan/20 rounded-[40px] opacity-0 group-hover:opacity-100 blur-2xl transition-all duration-500" />
                
                <div className="relative glass-card glass-card-hover rounded-[40px] overflow-hidden group shadow-2xl h-full flex flex-col bg-[#0D0D16]/40">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" />
                    
                    <div className="absolute inset-0 bg-bg-base/60 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-6">
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        onClick={() => openEditModal(project)}
                        className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-accent-violet hover:bg-white hover:text-bg-base transition-all shadow-glow-violet border border-white/20"
                      >
                        <Edit2 size={24} />
                      </motion.button>
                      <motion.button 
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        onClick={() => handleDelete(project._id)}
                        className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-accent-pink hover:bg-accent-pink hover:text-white transition-all shadow-glow-pink border border-white/20"
                      >
                        <Trash2 size={24} />
                      </motion.button>
                    </div>

                    <div className="absolute top-6 left-6 flex flex-col gap-2">
                      {project.featured && (
                        <div className="px-4 py-2 bg-gradient-primary text-white text-[9px] font-black uppercase tracking-widest rounded-xl shadow-glow-violet flex items-center gap-2 border border-white/20">
                          <Star size={12} fill="white" /> Featured
                        </div>
                      )}
                      <div className="px-3 py-1.5 glass rounded-lg text-[8px] font-black uppercase tracking-widest text-text-primary border border-white/10 w-fit backdrop-blur-xl">
                        {project.status.replace('-', ' ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-10 flex-grow flex flex-col">
                    <div className="mb-6">
                      <p className="text-[10px] font-black text-accent-violet uppercase tracking-[0.3em] mb-2">{project.category}</p>
                      <h3 className="text-3xl font-display font-black text-text-primary tracking-tighter group-hover:text-gradient transition-all duration-500 leading-tight">
                        {project.title}
                      </h3>
                    </div>

                    <p className="text-text-secondary text-sm font-medium line-clamp-2 mb-8 opacity-70 leading-relaxed">
                      {project.description}
                    </p>

                    <div className="mt-auto pt-8 border-t border-white/5 flex items-center justify-between">
                      <div className="flex -space-x-3">
                        {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                          <div key={i} className="w-10 h-10 glass rounded-xl border border-white/5 flex items-center justify-center text-[9px] font-black text-text-primary shadow-2xl bg-bg-surface group-hover:border-accent-violet/30 transition-colors">
                            {tech.charAt(0).toUpperCase()}
                          </div>
                        ))}
                      </div>
                      
                      <div className="flex items-center gap-2 text-accent-cyan">
                        <Cpu size={14} className="animate-pulse" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Asset Sync</span>
                      </div>
                    </div>
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
                    <div className="w-2 h-2 rounded-full bg-accent-violet shadow-glow-violet animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-violet">Protocol Initialization</span>
                  </div>
                  <h2 className="text-4xl font-display font-black text-text-primary tracking-tighter">
                    {editingProject ? 'Modify' : 'Launch'} <span className="text-gradient">Asset</span>
                  </h2>
                </div>
                <button onClick={() => setIsModalOpen(false)} className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-text-muted hover:text-text-primary transition-all">
                  <X size={28} />
                </button>
              </div>

              <div className="p-10 md:p-14 overflow-y-auto scrollbar-hide">
                <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-12">
                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Display Title</label>
                      <input 
                        name="title" 
                        value={formData.title} 
                        onChange={handleInputChange}
                        className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 focus:bg-white/[0.05] transition-all font-medium"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Categorization</label>
                        <input 
                          name="category" 
                          value={formData.category} 
                          onChange={handleInputChange}
                          className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 transition-all font-medium"
                          required
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Live Status</label>
                        <select 
                          name="status" 
                          value={formData.status} 
                          onChange={handleInputChange}
                          className="w-full glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 transition-all font-black appearance-none cursor-pointer uppercase text-[10px] tracking-widest"
                        >
                          <option value="completed">Active & Stable</option>
                          <option value="in-progress">Developing</option>
                          <option value="archived">Stored</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Project Abstract</label>
                      <textarea 
                        name="description" 
                        value={formData.description} 
                        onChange={handleInputChange}
                        rows={5}
                        className="w-full glass bg-white/[0.03] border border-white/5 rounded-[32px] p-8 text-text-primary outline-none focus:border-accent-violet/50 transition-all font-medium leading-relaxed"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-10">
                    <div className="space-y-4">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Asset Cover</label>
                      <div className="relative group cursor-pointer aspect-video glass bg-white/[0.03] border border-dashed border-white/10 rounded-[40px] flex flex-col items-center justify-center overflow-hidden hover:border-accent-violet/40 transition-all duration-700">
                        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
                        {thumbnail ? (
                          <img src={URL.createObjectURL(thumbnail)} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : formData.thumbnail ? (
                          <img src={formData.thumbnail} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        ) : (
                          <div className="text-center group-hover:scale-110 transition-transform duration-500">
                            <Upload className="text-accent-violet mb-4 mx-auto" size={40} />
                            <span className="text-[9px] font-black text-text-muted uppercase tracking-[0.3em]">Deploy Visual Asset</span>
                          </div>
                        )}
                        <input type="file" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] ml-2">Engineering Toolkit</label>
                      <div className="flex gap-4">
                        <input 
                          value={techInput}
                          onChange={(e) => setTechInput(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                          className="flex-grow glass bg-white/[0.03] border border-white/5 rounded-2xl py-5 px-6 text-text-primary outline-none focus:border-accent-violet/50 transition-all font-medium"
                          placeholder="Add Capability..."
                        />
                        <button type="button" onClick={addTech} className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center text-white shadow-glow-violet hover:scale-105 active:scale-95 transition-all">
                          <Plus size={28} />
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {formData.technologies.map((tech: string) => (
                          <span key={tech} className="tech-badge">
                            <div className="w-1.5 h-1.5 rounded-full bg-accent-violet shadow-glow-violet" />
                            {tech}
                            <X size={16} className="cursor-pointer text-text-muted hover:text-accent-pink transition-colors ml-2" onClick={() => removeTech(tech)} />
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="p-8 glass bg-accent-violet/[0.03] border border-white/5 rounded-[32px] flex items-center justify-between">
                      <div>
                        <p className="text-[12px] font-black text-text-primary uppercase tracking-widest mb-1">Highlight Project</p>
                        <p className="text-[9px] font-bold text-text-muted uppercase tracking-widest">Featured on main gallery</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          name="featured" 
                          checked={formData.featured} 
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-16 h-9 bg-white/5 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[6px] after:left-[6px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-gradient-primary shadow-2xl"></div>
                      </label>
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSaving}
                      className="w-full py-6 bg-gradient-primary rounded-[32px] font-black text-base uppercase tracking-widest shadow-glow-violet hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4"
                    >
                      {isSaving ? <Loader2 className="animate-spin" size={28} /> : <Save size={28} />}
                      {editingProject ? 'Update Architecture' : 'Initialize Asset'}
                    </button>
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
