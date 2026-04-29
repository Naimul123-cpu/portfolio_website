import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa';
import { Heart, ShieldCheck, Cpu } from 'lucide-react';
import type { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-32 relative overflow-hidden">
      {/* Aurora Divider */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12 py-24 relative z-10">
        <div className="grid md:grid-cols-4 gap-16 items-start">
          <div className="col-span-2">
            <h3 className="text-4xl font-display font-black text-gradient bg-gradient-aurora animate-gradient-shift bg-[length:400%_400%] mb-8 tracking-tighter">
              {profile?.name?.toUpperCase() || 'NAIM.DEV'}
            </h3>
            <p className="text-text-secondary text-lg max-w-sm font-medium leading-relaxed mb-10 tracking-wide">
              {profile?.tagline || 'Building high-performance digital architectures with passion and technical precision.'}
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaGithub size={20} />, link: profile?.socialLinks.github, glow: 'shadow-glow-violet' },
                { icon: <FaLinkedin size={20} />, link: profile?.socialLinks.linkedin, glow: 'shadow-glow-blue' },
                { icon: <FaTwitter size={20} />, link: profile?.socialLinks.twitter, glow: 'shadow-glow-cyan' },
                { icon: <FaDiscord size={20} />, link: profile?.socialLinks.discord, glow: 'shadow-glow-pink' },
              ].map((social, i) => social.link && (
                <a 
                  key={i}
                  href={social.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-secondary hover:text-text-primary border-white/5 hover:border-white/20 hover:${social.glow} transition-all duration-300`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-mono font-black mb-4 uppercase tracking-[0.3em] text-text-primary flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gradient-primary rounded-full" />
              Navigation
            </h4>
            {['About', 'Study', 'Experience', 'Projects', 'Contact'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase()}`} 
                className="text-text-secondary hover:text-accent-violet transition-all text-xs font-black uppercase tracking-[0.2em] group flex items-center gap-3"
              >
                <div className="w-0 h-[2px] bg-accent-violet group-hover:w-4 transition-all duration-300" />
                {item}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-6">
            <h4 className="text-[11px] font-mono font-black mb-4 uppercase tracking-[0.3em] text-text-primary flex items-center gap-3">
              <span className="w-8 h-[2px] bg-gradient-secondary rounded-full" />
              Identity
            </h4>
            {/* Admin access hidden for security */}
            
            <div className="p-4 glass rounded-2xl border border-white/5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald animate-pulse">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">System Status</p>
                <p className="text-[9px] font-bold text-accent-emerald uppercase">Operational</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
          <p>© {currentYear} {profile?.name || 'NAIM'}. Built for the future.</p>
          <div className="flex items-center gap-3 group px-6 py-2 glass rounded-full border border-white/5">
            <Cpu size={14} className="text-accent-violet" />
            <span>MERN STACK ARCHITECTURE</span>
            <Heart size={14} className="text-accent-pink fill-accent-pink animate-pulse" />
          </div>
        </div>
      </div>

      {/* Ground Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-px bg-gradient-to-r from-transparent via-accent-violet/20 to-transparent blur-xl" />
    </footer>
  );
};

export default Footer;
