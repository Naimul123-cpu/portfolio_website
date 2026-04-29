import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  Moon
} from 'lucide-react';

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: <LayoutDashboard size={20} /> },
    { label: 'Profile', path: '/admin/profile', icon: <Users size={20} /> },
    { label: 'Projects', path: '/admin/projects', icon: <FolderGit2 size={20} /> },
    { label: 'Experience', path: '/admin/experience', icon: <Briefcase size={20} /> },
    { label: 'Study', path: '/admin/study', icon: <GraduationCap size={20} /> },
  ];

  return (
    <aside className="w-64 glass border-r border-border p-6 flex flex-col fixed h-full z-50">
      <div className="mb-8 text-xl font-display font-black text-gradient tracking-widest">ADMIN PANEL</div>
      
      <div className="flex flex-col gap-4 mb-10">
        <div className="flex items-center gap-4 p-3 glass-card bg-bg-secondary/50">
          <div className="w-10 h-10 rounded-full bg-accent-violet flex items-center justify-center font-bold text-white shadow-lg shadow-accent-violet/20">
            {user?.name?.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <p className="font-bold truncate text-sm">{user?.name}</p>
            <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest">{user?.role}</p>
          </div>
        </div>

        <button 
          onClick={toggleTheme}
          className="flex items-center justify-between gap-3 p-3 glass-card bg-bg-secondary/30 hover:bg-bg-secondary transition-all"
        >
          <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">
            {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
          </span>
          {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
        </button>
      </div>

      <nav className="flex-grow space-y-1">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
              isActive(item.path) 
                ? 'bg-accent-violet/10 text-accent-violet border border-accent-violet/20 font-bold shadow-sm' 
                : 'text-text-secondary hover:bg-bg-secondary/50'
            }`}
          >
            {item.icon} <span className="text-sm uppercase tracking-widest font-bold">{item.label}</span>
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-accent-cyan/10 text-text-secondary hover:text-accent-cyan transition-all font-bold text-xs uppercase tracking-widest"
      >
        <LogOut size={18} /> Logout Session
      </button>
    </aside>
  );
};

export default AdminSidebar;
