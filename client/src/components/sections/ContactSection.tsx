import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, MapPin, Home, Send } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import type { IProfile } from '../../types';

interface ContactSectionProps {
  profile: IProfile | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  if (!profile) return null;

  const contactItems = [
    { 
      icon: <Mail size={24} />, 
      label: 'Email', 
      value: profile.email, 
      link: `mailto:${profile.email}`,
      show: !!profile.email 
    },
    { 
      icon: <Phone size={24} />, 
      label: 'Phone', 
      value: profile.phone, 
      link: `tel:${profile.phone}`,
      show: !!profile.phone 
    },
    { 
      icon: <MessageSquare size={24} />, 
      label: 'WhatsApp', 
      value: profile.whatsapp, 
      link: `https://wa.me/${profile.whatsapp?.replace(/\D/g, '')}`,
      show: !!profile.whatsapp 
    },
    { 
      icon: <MapPin size={24} />, 
      label: 'Present Address', 
      value: profile.presentAddress, 
      show: !!profile.presentAddress 
    },
    { 
      icon: <Home size={24} />, 
      label: 'Permanent Address', 
      value: profile.permanentAddress, 
      show: !!profile.permanentAddress 
    },
    { 
      icon: <Send size={24} />, 
      label: 'Location', 
      value: profile.location, 
      show: !!profile.location 
    },
  ].filter(item => item.show);

  return (
    <section id="contact" className="py-24 relative overflow-hidden">
      <SectionIllustration src="https://raw.githubusercontent.com/thoughtbot/undraw/master/lib/undraw/templates/undraw_contact_us_re_4n67.svg" />
      
      <div className="container mx-auto px-6 relative z-10">
        <SectionTitle 
          title="Get In Touch" 
          subtitle="Let's collaborate on something amazing or just say hello."
        />
        
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                {item.link ? (
                  <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noreferrer"
                    className="glass-card p-6 flex items-center gap-6 group hover:border-accent-violet/50 hover:-translate-y-1 transition-all"
                  >
                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent-violet group-hover:bg-accent-violet group-hover:text-white transition-all">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-text-primary break-all">{item.value}</p>
                    </div>
                  </a>
                ) : (
                  <div className="glass-card p-6 flex items-center gap-6">
                    <div className="w-14 h-14 glass rounded-2xl flex items-center justify-center text-accent-violet">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-1">{item.label}</p>
                      <p className="text-lg font-bold text-text-primary">{item.value}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
