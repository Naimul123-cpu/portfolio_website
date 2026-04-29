import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  LogOut,
  LayoutDashboard,
  Sun,
  Moon,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/naim-engine-room');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/system-control', icon: <LayoutDashboard size={18} /> },
    { label: 'Profile', path: '/system-control/profile', icon: <Users size={18} /> },
    { label: 'Projects', path: '/system-control/projects', icon: <FolderGit2 size={18} /> },
    { label: 'Experience', path: '/system-control/experience', icon: <Briefcase size={18} /> },
    { label: 'Study', path: '/system-control/study', icon: <GraduationCap size={18} /> },
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
            className="fixed inset-0 bg-bg-base/80 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`
        fixed top-0 left-0 bottom-0 w-72 glass border-r border-white/10 p-8 flex flex-col z-[70] 
        transition-transform duration-500 lg:translate-x-0 backdrop-blur-3xl shadow-[4px_0_32px_rgba(0,0,0,0.2)]
        overflow-y-auto scrollbar-hide
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="mb-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center text-white shadow-glow-violet">
              <LayoutDashboard size={20} />
            </div>
            <div className="text-xl font-display font-black text-gradient bg-gradient-aurora tracking-tighter">AURORA.CMS</div>
          </div>
          <button onClick={onClose} className="lg:hidden p-2 glass rounded-lg text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        
        <div className="flex flex-col gap-4 mb-10">
          <div className="p-5 glass rounded-3xl border border-white/10 bg-white/[0.03]">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-primary flex items-center justify-center font-black text-white shadow-lg text-lg">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-black truncate text-sm text-text-primary tracking-tight">{user?.name}</p>
                <span className="px-2 py-0.5 rounded-lg bg-accent-violet/10 border border-accent-violet/20 text-[8px] font-black text-accent-violet uppercase tracking-widest inline-block">
                  {user?.role}
                </span>
              </div>
            </div>
            
            <button 
              onClick={toggleTheme}
              className="w-full flex items-center justify-between gap-3 p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group"
            >
              <span className="text-[9px] font-black uppercase tracking-widest text-text-muted group-hover:text-text-primary">
                {theme === 'light' ? 'NIGHT MODE' : 'DAY MODE'}
              </span>
              <div className="p-1.5 rounded-lg bg-bg-surface text-text-primary">
                {theme === 'light' ? <Moon size={12} /> : <Sun size={12} />}
              </div>
            </button>
          </div>
        </div>

        <nav className="flex-grow space-y-3">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 pl-2">System Core</p>
          {navItems.map((item) => (
            <Link 
              key={item.path}
              to={item.path} 
              onClick={onClose}
              className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 group ${
                isActive(item.path) 
                  ? 'bg-gradient-primary text-white shadow-glow-violet translate-x-2' 
                  : 'text-text-secondary hover:bg-white/5 hover:text-text-primary border border-transparent hover:border-white/5'
              }`}
            >
              <div className={`${isActive(item.path) ? 'text-white' : 'text-accent-violet group-hover:scale-110'} transition-transform duration-300`}>
                {item.icon}
              </div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-black">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="pt-8 mt-auto border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-4 rounded-2xl bg-accent-pink/5 hover:bg-accent-pink/10 text-accent-pink border border-accent-pink/10 transition-all font-black text-[10px] uppercase tracking-widest hover:shadow-glow-pink"
          >
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
