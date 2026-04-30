import { 
  FaGithub, FaLinkedin, FaTwitter, FaDiscord, FaFacebook, FaInstagram, FaYoutube, 
  FaGlobe, FaTiktok, FaReddit, FaPinterest, FaBehance, FaDribbble, FaMedium, 
  FaTwitch, FaSlack, FaTelegram, FaSnapchat, FaStackOverflow, FaQuora, FaMastodon
} from 'react-icons/fa';
import { SiThreads } from 'react-icons/si';
import { Heart, Cpu, ShieldCheck } from 'lucide-react';
import type { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  const getLogoParts = () => {
    const text = profile?.logoText || profile?.name || 'NAIM.DEV';
    
    // Split by first dot if exists
    if (text.includes('.')) {
      const parts = text.split('.');
      return { main: parts[0].toUpperCase(), sub: '.' + parts.slice(1).join('.').toUpperCase() };
    }
    
    // Fallback to space split
    const parts = text.trim().split(' ');
    if (parts.length === 1) return { main: parts[0].toUpperCase(), sub: '.DEV' };
    return { main: parts[0].toUpperCase(), sub: ' ' + parts.slice(1).join(' ').toUpperCase() };
  };

  const logo = getLogoParts();

  const socialConfig: Record<string, { icon: React.ReactNode, color: string }> = {
    github: { icon: <FaGithub size={20} />, color: 'hover:text-white' },
    linkedin: { icon: <FaLinkedin size={20} />, color: 'hover:text-[#0077B5]' },
    twitter: { icon: <FaTwitter size={20} />, color: 'hover:text-[#1DA1F2]' },
    discord: { icon: <FaDiscord size={20} />, color: 'hover:text-[#5865F2]' },
    facebook: { icon: <FaFacebook size={20} />, color: 'hover:text-[#1877F2]' },
    instagram: { icon: <FaInstagram size={20} />, color: 'hover:text-[#E4405F]' },
    youtube: { icon: <FaYoutube size={20} />, color: 'hover:text-[#FF0000]' },
    website: { icon: <FaGlobe size={20} />, color: 'hover:text-accent-emerald' },
    tiktok: { icon: <FaTiktok size={20} />, color: 'hover:text-[#000000] hover:bg-white/10' },
    reddit: { icon: <FaReddit size={20} />, color: 'hover:text-[#FF4500]' },
    pinterest: { icon: <FaPinterest size={20} />, color: 'hover:text-[#BD081C]' },
    behance: { icon: <FaBehance size={20} />, color: 'hover:text-[#1769FF]' },
    dribbble: { icon: <FaDribbble size={20} />, color: 'hover:text-[#EA4C89]' },
    medium: { icon: <FaMedium size={20} />, color: 'hover:text-white' },
    twitch: { icon: <FaTwitch size={20} />, color: 'hover:text-[#9146FF]' },
    slack: { icon: <FaSlack size={20} />, color: 'hover:text-[#4A154B]' },
    telegram: { icon: <FaTelegram size={20} />, color: 'hover:text-[#0088CC]' },
    snapchat: { icon: <FaSnapchat size={20} />, color: 'hover:text-[#FFFC00]' },
    stackoverflow: { icon: <FaStackOverflow size={20} />, color: 'hover:text-[#F48024]' },
    quora: { icon: <FaQuora size={20} />, color: 'hover:text-[#B92B27]' },
    mastodon: { icon: <FaMastodon size={20} />, color: 'hover:text-[#6364FF]' },
    threads: { icon: <SiThreads size={20} />, color: 'hover:text-white' },
  };

  return (
    <footer className="relative pt-32 pb-16 bg-bg-base overflow-hidden">
      {/* Full-width Gradient Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-violet/50 to-transparent" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid lg:grid-cols-12 gap-16 items-start">
          {/* Identity Column */}
          <div className="lg:col-span-5">
            <h3 className="text-4xl font-display font-black tracking-tighter mb-8 uppercase">
              <span className="text-gradient-aurora">{logo.main}</span>
              <span className="text-text-primary">{logo.sub}</span>
            </h3>
            <p className="text-text-secondary text-lg max-w-sm font-medium leading-relaxed mb-10 opacity-70">
              {profile?.tagline || 'Designing resilient infrastructure and sustainable engineering solutions for the modern age.'}
            </p>
            <div className="flex flex-wrap gap-4">
              {profile?.socialLinks && Object.entries(profile.socialLinks).map(([platform, link]) => {
                const config = socialConfig[platform];
                if (!link || !config) return null;
                return (
                  <a 
                    key={platform}
                    href={link as string} 
                    target="_blank" 
                    rel="noreferrer" 
                    className={`w-12 h-12 glass rounded-2xl flex items-center justify-center text-text-muted transition-all duration-300 ${config.color} hover:border-white/20`}
                  >
                    {config.icon}
                  </a>
                );
              })}
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
