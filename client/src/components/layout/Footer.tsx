import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { Heart } from 'lucide-react';
import { IProfile } from '../../types';

interface FooterProps {
  profile: IProfile | null;
}

const Footer: React.FC<FooterProps> = ({ profile }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-20 py-12 border-t border-border bg-bg-secondary/50">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-12 items-start">
          <div>
            <h3 className="text-xl font-display font-semibold text-text-primary mb-4">
              {profile?.name || 'Portfolio CMS'}
            </h3>
            <p className="text-text-secondary text-sm max-w-xs font-light">
              {profile?.tagline || 'Building purposeful digital experiences with passion and precision.'}
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-sm font-semibold mb-2 uppercase tracking-widest text-text-primary">Navigation</h4>
            <a href="#about" className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-light">About</a>
            <a href="#projects" className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-light">Work</a>
            <a href="#experience" className="text-text-secondary hover:text-accent-primary transition-colors text-sm font-light">Experience</a>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-4 uppercase tracking-widest text-text-primary">Connect</h4>
            <div className="flex gap-4">
              {profile?.socialLinks.github && (
                <a href={profile.socialLinks.github} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaGithub size={20} />
                </a>
              )}
              {profile?.socialLinks.linkedin && (
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaLinkedin size={20} />
                </a>
              )}
              {profile?.socialLinks.twitter && (
                <a href={profile.socialLinks.twitter} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaTwitter size={20} />
                </a>
              )}
              {profile?.socialLinks.facebook && (
                <a href={profile.socialLinks.facebook} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaFacebook size={20} />
                </a>
              )}
              {profile?.socialLinks.instagram && (
                <a href={profile.socialLinks.instagram} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaInstagram size={20} />
                </a>
              )}
              {profile?.socialLinks.youtube && (
                <a href={profile.socialLinks.youtube} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaYoutube size={20} />
                </a>
              )}
              {profile?.socialLinks.discord && (
                <a href={profile.socialLinks.discord} target="_blank" rel="noreferrer" className="text-text-secondary hover:text-accent-primary transition-colors">
                  <FaDiscord size={20} />
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center gap-4 text-text-secondary text-sm">
          <p>© {currentYear} {profile?.name}. All rights reserved.</p>
          <p className="flex items-center gap-2">
            Built with <Heart size={14} className="text-accent-tertiary fill-accent-tertiary" /> using React & Express
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
