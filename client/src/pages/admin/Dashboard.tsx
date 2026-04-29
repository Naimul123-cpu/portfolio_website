import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  ExternalLink,
  Settings,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import GlowButton from '../../components/ui/GlowButton';
import AdminSidebar from '../../components/layout/AdminSidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { studies, experiences, projects } = usePortfolioData();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const stats = [
    { label: 'Projects', value: projects.length, icon: <FolderGit2 size={24} />, color: 'bg-accent-violet' },
    { label: 'Experience', value: experiences.length, icon: <Briefcase size={24} />, color: 'bg-accent-cyan' },
    { label: 'Education', value: studies.length, icon: <GraduationCap size={24} />, color: 'bg-accent-violet' },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex overflow-hidden">
      {/* Aurora Orbs for Admin */}
      <div className="aurora-container opacity-20">
        <div className="aurora-orb orb-1 scale-75" />
        <div className="aurora-orb orb-2 scale-75" />
      </div>
      <div className="bg-texture opacity-[0.02]" />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-grow lg:ml-72 p-6 md:p-12 relative z-10 overflow-y-auto max-h-screen">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-3 glass rounded-2xl text-accent-violet shadow-glow-violet"
            >
              <Settings size={24} className="animate-spin-slow" />
            </button>
            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="px-4 py-1.5 glass rounded-full text-[10px] font-black uppercase tracking-[0.2em] text-accent-violet border border-white/10">
                  Control Center
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-black text-text-primary tracking-tight">
                Welcome back, <span className="text-gradient bg-gradient-aurora">{user?.name}</span>
              </h1>
              <p className="mt-4 text-text-secondary font-medium tracking-wide text-lg">Manage your engineering universe with precision.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <GlowButton onClick={() => window.open('/', '_blank')} variant="outline" className="flex items-center gap-3">
              Live Preview <ExternalLink size={16} />
            </GlowButton>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
              className="glass p-8 rounded-[32px] border border-white/10 relative overflow-hidden group transition-all duration-500 shadow-2xl"
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${stat.color} opacity-10 blur-[40px] group-hover:opacity-20 transition-opacity`} />
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-3">{stat.label}</p>
                  <p className="text-5xl font-display font-black text-text-primary">{stat.value}</p>
                </div>
                <div className={`w-16 h-16 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  {stat.icon}
                </div>
              </div>
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-accent-emerald">
                <span className="w-2 h-2 rounded-full bg-accent-emerald animate-pulse" />
                Active Database
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-10">
          <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-2xl font-black text-text-primary tracking-tight">Recent Projects</h2>
              <Link to="/system-control/projects" className="text-accent-violet text-[10px] font-black uppercase tracking-widest hover:underline flex items-center gap-2">
                Manage All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="space-y-6">
              {projects.slice(0, 4).map(proj => (
                <div key={proj._id} className="flex items-center gap-6 p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 group/item">
                  <div className="w-16 h-16 rounded-2xl bg-bg-base border border-white/10 overflow-hidden shadow-2xl relative">
                    <img src={proj.thumbnail} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-black text-text-primary text-lg tracking-tight mb-1">{proj.title}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">{proj.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded-lg text-[9px] bg-accent-cyan/10 text-accent-cyan uppercase font-black tracking-widest border border-accent-cyan/20">
                      {proj.status}
                    </span>
                  </div>
                </div>
              ))}
              {projects.length === 0 && (
                <div className="text-center py-10 opacity-30">
                  <FolderGit2 size={40} className="mx-auto mb-4" />
                  <p className="text-sm font-bold uppercase tracking-widest">No Projects Found</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass p-10 rounded-[40px] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <h2 className="text-2xl font-black text-text-primary tracking-tight mb-10">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-6">
              {[
                { label: 'Project', path: '/system-control/projects', icon: <FolderGit2 />, color: 'text-accent-violet bg-accent-violet/10 border-accent-violet/20 hover:bg-accent-violet/20 hover:shadow-glow-violet' },
                { label: 'Experience', path: '/system-control/experience', icon: <Briefcase />, color: 'text-accent-blue bg-accent-blue/10 border-accent-blue/20 hover:bg-accent-blue/20 hover:shadow-glow-blue' },
                { label: 'Study Log', path: '/system-control/study', icon: <GraduationCap />, color: 'text-accent-cyan bg-accent-cyan/10 border-accent-cyan/20 hover:bg-accent-cyan/20 hover:shadow-glow-cyan' },
                { label: 'Profile Settings', path: '/system-control/profile', icon: <Settings />, color: 'text-text-primary bg-white/5 border-white/10 hover:bg-white/10' },
              ].map((action, i) => (
                <Link 
                  key={i}
                  to={action.path} 
                  className={`p-8 rounded-[32px] border flex flex-col items-center justify-center gap-4 transition-all duration-500 group/action scale-100 active:scale-95 ${action.color}`}
                >
                  <div className="p-4 rounded-2xl bg-white/10 group-hover/action:scale-125 group-hover/action:rotate-6 transition-all duration-500">
                    {React.cloneElement(action.icon as React.ReactElement<any>, { size: 32 })}
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-[0.2em] text-center">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
