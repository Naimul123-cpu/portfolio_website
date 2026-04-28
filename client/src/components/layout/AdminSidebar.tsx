import React from 'react';
import { 
  Users, 
  Briefcase, 
  GraduationCap, 
  FolderGit2, 
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminSidebar: React.FC = () => {
  const { user, logout } = useAuth();
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
    <aside className="w-64 glass border-r border-white/5 p-6 flex flex-col fixed h-full z-50">
      <div className="mb-10 text-xl font-display font-black text-gradient">ADMIN PANEL</div>
      
      <div className="flex items-center gap-4 p-4 glass rounded-xl mb-10">
        <div className="w-10 h-10 rounded-full bg-accent-primary flex items-center justify-center font-bold">
          {user?.name?.charAt(0)}
        </div>
        <div className="overflow-hidden">
          <p className="font-bold truncate">{user?.name}</p>
          <p className="text-xs text-text-secondary uppercase">{user?.role}</p>
        </div>
      </div>

      <nav className="flex-grow space-y-2">
        {navItems.map((item) => (
          <Link 
            key={item.path}
            to={item.path} 
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              isActive(item.path) 
                ? 'bg-white/5 text-accent-primary border border-accent-primary/20' 
                : 'text-text-secondary hover:bg-white/5'
            }`}
          >
            {item.icon} {item.label}
          </Link>
        ))}
      </nav>

      <button 
        onClick={handleLogout}
        className="mt-auto flex items-center gap-3 p-3 rounded-lg hover:bg-accent-tertiary/20 text-accent-tertiary transition-colors"
      >
        <LogOut size={20} /> Logout
      </button>
    </aside>
  );
};

export default AdminSidebar;
