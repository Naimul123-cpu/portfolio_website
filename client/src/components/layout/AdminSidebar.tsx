import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  LogOut,
  LayoutDashboard,
  X,
  Cpu
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/naim-engine-room');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/system-control', icon: <LayoutDashboard size={18} /> },
    { label: 'Profile Settings', path: '/system-control/profile', icon: <Users size={18} /> },
    { label: 'Project Assets', path: '/system-control/projects', icon: <FolderGit2 size={18} /> },
    { label: 'Experience Cycle', path: '/system-control/experience', icon: <Briefcase size={18} /> },
    { label: 'Academic Blueprint', path: '/system-control/study', icon: <GraduationCap size={18} /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-bg-base/90 backdrop-blur-md z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 bottom-0 w-80 bg-[#050508] border-r border-white/5 flex flex-col z-[70] 
        transition-transform duration-700 lg:translate-x-0 shadow-[10px_0_40px_rgba(0,0,0,0.4)]
        overflow-y-auto scrollbar-hide
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Sidebar Header */}
        <div className="p-10 mb-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center text-white shadow-glow-violet">
              <Cpu size={24} />
            </div>
            <div className="text-2xl font-display font-black tracking-tighter">
              <span className="text-gradient">AURORA</span>
              <span className="text-text-primary">.CMS</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 glass rounded-xl text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        
        {/* User Module */}
        <div className="px-10 mb-10">
          <div className="p-6 glass rounded-3xl border border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-bg-surface border border-white/10 flex items-center justify-center font-black text-text-primary text-xl shadow-2xl">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-black truncate text-[13px] text-text-primary tracking-tight">{user?.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-accent-violet animate-pulse shadow-glow-violet" />
                  <span className="text-[9px] font-black text-text-muted uppercase tracking-widest">
                    {user?.role} Mode
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Core */}
        <nav className="flex-grow px-6 space-y-2">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.4em] mb-6 pl-4">System Protocols</p>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={onClose}
              className={`relative flex items-center gap-4 p-5 rounded-2xl transition-all duration-500 group ${
                isActive(item.path) 
                  ? 'bg-accent-violet/10 text-text-primary' 
                  : 'text-text-muted hover:bg-white/[0.03] hover:text-text-secondary'
              }`}
            >
              {/* Active Indicator Bar */}
              {isActive(item.path) && (
                <motion.div 
                  layoutId="adminNavActive"
                  className="absolute left-0 w-1 h-8 bg-gradient-primary rounded-full" 
                />
              )}
              
              <div className={`${isActive(item.path) ? 'text-accent-violet' : 'group-hover:text-text-primary transition-colors'}`}>
                {item.icon}
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-black">{item.label}</span>
              
              {isActive(item.path) && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-violet shadow-glow-violet" />
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-8 mt-auto border-t border-white/5 bg-black/40">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-4 p-5 rounded-2xl bg-accent-pink/5 hover:bg-accent-pink/10 text-accent-pink border border-accent-pink/10 transition-all font-black text-[10px] uppercase tracking-[0.4em] hover:shadow-glow-pink"
          >
            <LogOut size={18} /> Exit System
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
