import React from 'react';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  ExternalLink,
  Settings,
  ArrowRight,
  Zap,
  Activity,
  Cpu
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { usePortfolioData } from '../../hooks/usePortfolioData';
import AdminSidebar from '../../components/layout/AdminSidebar';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { studies, experiences, projects } = usePortfolioData();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const stats = [
    { label: 'Project Assets', value: projects.length, icon: <FolderGit2 size={24} />, color: 'accent-violet', glow: 'shadow-glow-violet' },
    { label: 'Deployment Nodes', value: experiences.length, icon: <Briefcase size={24} />, color: 'accent-cyan', glow: 'shadow-glow-cyan' },
    { label: 'Academic Blueprints', value: studies.length, icon: <GraduationCap size={24} />, color: 'accent-pink', glow: 'shadow-glow-pink' },
  ];

  return (
    <div className="min-h-screen bg-bg-base flex overflow-hidden">
      {/* Background Orbs */}
      <div className="aurora-container opacity-20">
        <div className="aurora-orb orb-1 scale-75" />
        <div className="aurora-orb orb-2 scale-75" />
      </div>
      <div className="bg-texture opacity-[0.02]" />

      <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="flex-grow lg:ml-80 p-8 md:p-14 relative z-10 overflow-y-auto max-h-screen scrollbar-hide">
        {/* Header Module */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-20">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent-violet shadow-glow-violet"
            >
              <Settings size={24} className="animate-spin-slow" />
            </button>
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-violet animate-pulse shadow-glow-violet" />
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-accent-violet">System Online</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-black text-text-primary tracking-tighter">
                Control <span className="text-gradient-aurora">Center</span>
              </h1>
              <p className="mt-4 text-text-muted font-medium tracking-wide text-lg max-w-xl opacity-80 uppercase text-[11px] tracking-[0.2em]">Authorized Access: {user?.name}</p>
            </div>
          </div>
          <button 
            onClick={() => window.open('/', '_blank')}
            className="group relative px-8 py-4 glass border border-white/10 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-3 hover:border-accent-violet/50 transition-all"
          >
            <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity" />
            Live Preview <ExternalLink size={16} className="text-accent-violet" />
          </button>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className={`absolute -inset-1 bg-${stat.color} rounded-[40px] blur-2xl opacity-0 group-hover:opacity-10 transition-opacity`} />
              <div className="relative glass p-10 rounded-[40px] border border-white/5 hover:border-white/10 transition-all duration-500 shadow-2xl">
                <div className="flex justify-between items-start mb-8">
                  <div className={`w-16 h-16 rounded-2xl bg-bg-surface flex items-center justify-center text-${stat.color} shadow-2xl border border-white/5 group-hover:scale-110 transition-transform duration-500`}>
                    {stat.icon}
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-text-muted mb-2">{stat.label}</p>
                    <p className="text-5xl font-display font-black text-text-primary tracking-tighter">{stat.value}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-accent-emerald">
                  <Activity size={14} className="animate-pulse" />
                  Synced & Operational
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Center */}
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Recent Deployments */}
          <div className="lg:col-span-7">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-accent-violet/10 to-accent-cyan/10 rounded-[40px] blur-2xl opacity-50" />
              <div className="relative glass p-12 rounded-[40px] border border-white/5">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <Zap size={24} className="text-accent-violet" />
                    <h2 className="text-2xl font-black text-text-primary tracking-tight">Recent Assets</h2>
                  </div>
                  <Link to="/system-control/projects" className="text-accent-violet text-[10px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors flex items-center gap-3 group/link">
                    Protocol Access <ArrowRight size={14} className="group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
                
                <div className="space-y-6">
                  {projects.slice(0, 4).map(proj => (
                    <div key={proj._id} className="flex items-center gap-6 p-6 rounded-[32px] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 group/item">
                      <div className="w-20 h-20 rounded-2xl bg-bg-base border border-white/5 overflow-hidden shadow-2xl relative">
                        <img src={proj.thumbnail} alt="" className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-700" />
                      </div>
                      <div className="flex-grow">
                        <p className="font-black text-text-primary text-xl tracking-tighter mb-2">{proj.title}</p>
                        <p className="text-[9px] text-accent-cyan uppercase tracking-[0.3em] font-black">{proj.category}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-accent-cyan animate-pulse shadow-glow-cyan" />
                        <span className="text-[10px] text-text-primary uppercase font-black tracking-widest">{proj.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Command Node */}
          <div className="lg:col-span-5 space-y-10">
            <div className="glass p-12 rounded-[40px] border border-white/5 bg-accent-violet/[0.02]">
              <div className="flex items-center gap-4 mb-12">
                <Cpu size={24} className="text-accent-cyan" />
                <h2 className="text-2xl font-black text-text-primary tracking-tight">Quick Commands</h2>
              </div>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { label: 'New Project', path: '/system-control/projects', icon: <FolderGit2 />, color: 'accent-violet' },
                  { label: 'Log Exp.', path: '/system-control/experience', icon: <Briefcase />, color: 'accent-cyan' },
                  { label: 'Update Study', path: '/system-control/study', icon: <GraduationCap />, color: 'accent-pink' },
                  { label: 'Identity Settings', path: '/system-control/profile', icon: <Settings />, color: 'text-white' },
                ].map((action, i) => (
                  <Link 
                    key={i}
                    to={action.path} 
                    className="group flex flex-col items-center justify-center p-8 rounded-[32px] border border-white/5 hover:border-white/20 hover:bg-white/[0.03] transition-all duration-500 active:scale-95"
                  >
                    <div className={`p-5 rounded-2xl bg-bg-surface border border-white/5 text-${action.color} group-hover:scale-110 group-hover:shadow-glow-violet transition-all duration-500 mb-4 shadow-2xl`}>
                      {React.cloneElement(action.icon as React.ReactElement<any>, { size: 28 })}
                    </div>
                    <span className="font-black text-[9px] uppercase tracking-[0.2em] text-text-muted group-hover:text-text-primary text-center">{action.label}</span>
                  </Link>
                ))}
              </div>
            </div>
            
            <div className="p-10 glass rounded-[40px] border border-white/5 bg-gradient-to-br from-accent-violet/10 to-transparent">
              <h3 className="text-xl font-black text-text-primary mb-4 flex items-center gap-3">
                <Activity size={20} className="text-accent-pink" /> 
                System Latency
              </h3>
              <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] leading-relaxed">
                Database synchronization is optimized for real-time portfolio deployments. All assets are currently verified and resilient.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
