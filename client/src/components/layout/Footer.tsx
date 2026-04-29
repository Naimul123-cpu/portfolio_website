import { Link } from 'react-router-dom';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { Heart, Lock } from 'lucide-react';
import { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 py-20 border-t border-border bg-bg-card relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-accent-violet/5 blur-[100px] rounded-full -mb-20 -mr-20" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-4 gap-12 items-start">
          <div className="col-span-2">
            <h3 className="text-3xl font-display font-black text-gradient mb-6 tracking-tighter">
              {profile?.name?.toUpperCase() || 'NAIM.DEV'}
            </h3>
            <p className="text-text-secondary text-base max-w-sm font-light leading-relaxed mb-8">
              {profile?.tagline || 'Building purposeful digital experiences with passion and precision.'}
            </p>
            <div className="flex gap-4">
              {profile?.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all">
                  <FaGithub size={18} />
                </a>
              )}
              {profile?.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all">
                  <FaLinkedin size={18} />
                </a>
              )}
              {profile?.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="w-10 h-10 glass rounded-xl flex items-center justify-center text-text-secondary hover:text-accent-violet hover:border-accent-violet/50 transition-all">
                  <FaTwitter size={18} />
                </a>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-text-primary">Navigation</h4>
            <a href="#about" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest">About</a>
            <a href="#study" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest">Study</a>
            <a href="#experience" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest">Experience</a>
            <a href="#projects" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest">Projects</a>
            <a href="#contact" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest">Contact</a>
          </div>

          <div className="flex flex-col gap-4">
            <h4 className="text-[10px] font-black mb-4 uppercase tracking-[0.3em] text-text-primary">System</h4>
            <Link to="/login" className="text-text-secondary hover:text-accent-violet transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <Lock size={14} /> Admin Access
            </Link>
            <div className="mt-4 p-4 glass-card text-[10px] font-bold text-text-secondary/50 uppercase tracking-widest">
              Status: Operational
            </div>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t border-border/20 flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] font-black uppercase tracking-[0.3em] text-text-secondary">
          <p>© {currentYear} {profile?.name || 'NAIM'}. All rights reserved.</p>
          <div className="flex items-center gap-2 group">
            Built with <Heart size={14} className="text-accent-cyan fill-accent-cyan animate-pulse" /> using MERN Stack
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
