import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  Plus, 
  ExternalLink,
  Settings,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import AdminSidebar from '../../components/layout/AdminSidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { studies, experiences, projects } = usePortfolioData();

  const stats = [
    { label: 'Projects', value: projects.length, icon: <FolderGit2 size={24} />, color: 'bg-accent-violet' },
    { label: 'Experience', value: experiences.length, icon: <Briefcase size={24} />, color: 'bg-accent-cyan' },
    { label: 'Education', value: studies.length, icon: <GraduationCap size={24} />, color: 'bg-accent-violet' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-black mb-2 text-gradient tracking-tight">Welcome Back, {user?.name}</h1>
            <p className="text-text-secondary font-medium tracking-wide">Here's an overview of your portfolio performance.</p>
          </div>
          <div className="flex gap-4">
            <GlowButton onClick={() => window.open('/', '_blank')} variant="outline" className="flex items-center gap-2 border-border text-text-primary">
              View Site <ExternalLink size={18} />
            </GlowButton>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex items-center gap-6 group hover:border-accent-violet/30"
            >
              <div className={`p-4 rounded-2xl ${stat.color} text-white shadow-lg shadow-current/20 group-hover:scale-110 transition-transform`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-text-secondary text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-display font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <Link to="/admin/projects" className="text-accent-violet text-sm font-bold hover:underline">Manage All</Link>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 3).map(proj => (
                <div key={proj._id} className="flex items-center gap-4 p-4 glass-card bg-bg-secondary/50 border-border/50">
                  <div className="w-12 h-12 rounded-lg bg-bg-primary border border-border/50 overflow-hidden shadow-sm">
                    <img src={proj.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">{proj.title}</p>
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">{proj.category}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-accent-cyan/10 text-accent-cyan uppercase font-black tracking-tighter border border-accent-cyan/20">{proj.status}</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-text-secondary text-center py-4 text-sm">No projects found.</p>}
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/projects" className="p-6 bg-accent-violet/10 border border-accent-violet/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-violet/20 transition-all group">
                <Plus size={24} className="text-accent-violet group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest text-accent-violet">Add Project</span>
              </Link>
              <Link to="/admin/experience" className="p-6 bg-accent-cyan/10 border border-accent-cyan/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-cyan/20 transition-all group">
                <Plus size={24} className="text-accent-cyan group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest text-accent-cyan">Add Experience</span>
              </Link>
              <Link to="/admin/profile" className="p-6 glass-card bg-bg-secondary/50 border border-border flex flex-col items-center gap-2 hover:bg-bg-secondary transition-all group">
                <Settings size={24} className="text-text-secondary group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest text-text-secondary">Profile</span>
              </Link>
              <Link to="/admin/study" className="p-6 bg-accent-violet/10 border border-accent-violet/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-violet/20 transition-all group">
                <Plus size={24} className="text-accent-violet group-hover:scale-125 transition-transform" />
                <span className="font-bold text-xs uppercase tracking-widest text-accent-violet">Add Study</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
