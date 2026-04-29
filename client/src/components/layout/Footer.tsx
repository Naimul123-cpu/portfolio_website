import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaDiscord } from 'react-icons/fa';
import { Heart, Cpu, ShieldCheck } from 'lucide-react';
import type { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative pt-32 pb-16 bg-bg-base overflow-hidden">
      {/* Full-width Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-violet/50 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Identity Column */}
          <div className="lg:col-span-5">
            <h3 className="text-4xl font-display font-black tracking-tighter mb-8">
              <span className="text-gradient-aurora uppercase">{profile?.name || 'NAIM'}</span>
              <span className="text-text-primary">.DEV</span>
            </h3>
            <p className="text-text-secondary text-lg max-w-sm font-medium leading-relaxed mb-10 opacity-70">
              {profile?.tagline || 'Designing resilient infrastructure and sustainable engineering solutions for the modern age.'}
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaGithub size={20} />, link: profile?.socialLinks.github, color: 'hover:text-white' },
                { icon: <FaLinkedin size={20} />, link: profile?.socialLinks.linkedin, color: 'hover:text-accent-cyan' },
                { icon: <FaTwitter size={20} />, link: profile?.socialLinks.twitter, color: 'hover:text-accent-blue' },
                { icon: <FaDiscord size={20} />, link: profile?.socialLinks.discord, color: 'hover:text-accent-pink' },
              ].map((social, i) => social.link && (
                <a 
                  key={i}
                  href={social.link} 
                  target="_blank" 
                  rel="noreferrer" 
                  className={`w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-muted transition-all duration-300 ${social.color} hover:border-white/20`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Column */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-primary mb-10 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-accent-violet rounded-full" />
              Navigation
            </h4>
            <div className="flex flex-col gap-6">
              {['About', 'Study', 'Experience', 'Projects', 'Contact'].map((item) => (
                <a 
                  key={item}
                  href={`#${item.toLowerCase()}`} 
                  className="text-text-muted hover:text-text-primary transition-all text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 group"
                >
                  <div className="w-0 h-[2px] bg-accent-violet group-hover:w-4 transition-all duration-300" />
                  {item}
                </a>
              ))}
            </div>
          </div>

          {/* System Info Column */}
          <div className="lg:col-span-4">
            <h4 className="text-[11px] font-black uppercase tracking-[0.3em] text-text-primary mb-10 flex items-center gap-3">
              <div className="w-8 h-[2px] bg-accent-cyan rounded-full" />
              Identity Protocol
            </h4>
            
            <div className="space-y-6">
              <div className="p-6 glass rounded-[24px] border border-white/5 flex items-center gap-6 group hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-accent-emerald/10 flex items-center justify-center text-accent-emerald animate-pulse">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">Operational Status</p>
                  <p className="text-[9px] font-bold text-accent-emerald uppercase mt-1">System Live & Optimized</p>
                </div>
              </div>

              <div className="p-6 glass rounded-[24px] border border-white/5 flex items-center gap-6 group hover:border-white/20 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-accent-violet/10 flex items-center justify-center text-accent-violet">
                  <Cpu size={20} />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-text-primary">Core Engine</p>
                  <p className="text-[9px] font-bold text-text-muted uppercase mt-1">MERN Stack Architecture</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-32 pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[11px] font-black uppercase tracking-[0.3em] text-text-muted">
            © {currentYear} {profile?.name || 'NAIM'}. All Rights Integrated.
          </p>
          
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-text-primary glass px-6 py-2.5 rounded-full border border-white/5">
            Designed with <Heart size={12} className="text-accent-pink fill-accent-pink animate-pulse inline mx-1" /> for the future
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
