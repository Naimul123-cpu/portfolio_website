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
    { label: 'Projects', value: projects.length, icon: <FolderGit2 size={24} />, color: 'bg-accent-primary' },
    { label: 'Experience', value: experiences.length, icon: <Briefcase size={24} />, color: 'bg-accent-secondary' },
    { label: 'Education', value: studies.length, icon: <GraduationCap size={24} />, color: 'bg-accent-tertiary' },
  ];

  return (
    <div className="min-h-screen bg-bg-primary flex">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-grow ml-64 p-10">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-display font-bold mb-2">Welcome Back, {user?.name}</h1>
            <p className="text-text-secondary">Here's an overview of your portfolio performance.</p>
          </div>
          <div className="flex gap-4">
            <GlowButton onClick={() => window.open('/', '_blank')} variant="outline" className="flex items-center gap-2">
              View Site <ExternalLink size={18} />
            </GlowButton>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              whileHover={{ y: -5 }}
              className="glass-card p-6 flex items-center gap-6"
            >
              <div className={`p-4 rounded-2xl ${stat.color} text-white`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-text-secondary text-sm font-bold uppercase tracking-widest">{stat.label}</p>
                <p className="text-3xl font-display font-black">{stat.value}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="glass-card p-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Projects</h2>
              <Link to="/admin/projects" className="text-accent-primary text-sm font-bold hover:underline">Manage All</Link>
            </div>
            <div className="space-y-4">
              {projects.slice(0, 3).map(proj => (
                <div key={proj._id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/5">
                  <div className="w-12 h-12 rounded-lg bg-bg-primary overflow-hidden">
                    <img src={proj.thumbnail} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold">{proj.title}</p>
                    <p className="text-xs text-text-secondary">{proj.category}</p>
                  </div>
                  <div className="ml-auto">
                    <span className="px-2 py-0.5 rounded text-[10px] bg-accent-secondary/10 text-accent-secondary uppercase font-bold">{proj.status}</span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && <p className="text-text-secondary text-center py-4">No projects found.</p>}
            </div>
          </div>

          <div className="glass-card p-8">
            <h2 className="text-xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/projects" className="p-4 bg-accent-primary/10 border border-accent-primary/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-primary/20 transition-all group">
                <Plus size={24} className="text-accent-primary group-hover:scale-125 transition-transform" />
                <span className="font-bold text-sm">Add Project</span>
              </Link>
              <Link to="/admin/experience" className="p-4 bg-accent-secondary/10 border border-accent-secondary/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-secondary/20 transition-all group">
                <Plus size={24} className="text-accent-secondary group-hover:scale-125 transition-transform" />
                <span className="font-bold text-sm">Add Experience</span>
              </Link>
              <Link to="/admin/profile" className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all group">
                <Settings size={24} className="text-text-secondary group-hover:scale-125 transition-transform" />
                <span className="font-bold text-sm">Update Profile</span>
              </Link>
              <Link to="/admin/study" className="p-4 bg-accent-tertiary/10 border border-accent-tertiary/30 rounded-2xl flex flex-col items-center gap-2 hover:bg-accent-tertiary/20 transition-all group">
                <Plus size={24} className="text-accent-tertiary group-hover:scale-125 transition-transform" />
                <span className="font-bold text-sm">Add Study</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
