import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MessageSquare, MapPin, Home, Send, MessageCircle } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import SectionIllustration from '../ui/SectionIllustration';
import AnimatedCard from '../ui/AnimatedCard';
import GlowButton from '../ui/GlowButton';
import type { IProfile } from '../../types';

interface ContactSectionProps {
  profile: IProfile | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  if (!profile) return null;

  const contactItems = [
    { 
      icon: <Mail size={24} />, 
      label: 'Direct Email', 
      value: profile.email, 
      link: `mailto:${profile.email}`,
      color: 'text-accent-violet',
      glow: 'shadow-glow-violet'
    },
    { 
      icon: <Phone size={24} />, 
      label: 'Phone Call', 
      value: profile.phone, 
      link: `tel:${profile.phone}`,
      color: 'text-accent-blue',
      glow: 'shadow-glow-blue'
    },
    { 
      icon: <MessageCircle size={24} />, 
      label: 'WhatsApp Me', 
      value: profile.whatsapp, 
      link: `https://wa.me/${profile.whatsapp?.replace(/\D/g, '')}`,
      color: 'text-accent-emerald',
      glow: 'shadow-glow-emerald'
    },
    { 
      icon: <MapPin size={24} />, 
      label: 'Current Base', 
      value: profile.presentAddress, 
      color: 'text-accent-cyan',
      glow: 'shadow-glow-cyan'
    },
    { 
      icon: <Home size={24} />, 
      label: 'Permanent Hub', 
      value: profile.permanentAddress, 
      color: 'text-accent-pink',
      glow: 'shadow-glow-pink'
    },
    { 
      icon: <Send size={24} />, 
      label: 'Service Zone', 
      value: profile.location, 
      color: 'text-accent-amber',
      glow: ''
    },
  ].filter(item => item.value);

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      <SectionIllustration icon={<MessageSquare />} className="opacity-10" />
      
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="CONTACT"
          title="Let's Start A <Conversation>" 
          subtitle="Whether you have a project in mind or just want to connect, I'm always open to new opportunities."
        />
        
        <div className="max-w-6xl mx-auto">
          <AnimatedCard gradient className="p-0 mb-16 overflow-hidden">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 divide-y md:divide-y-0 md:divide-x border-white/5">
              {contactItems.map((item) => (
                <div key={item.label} className="group p-10 hover:bg-white/[0.02] transition-colors duration-500">
                  <div className={`w-14 h-14 glass rounded-2xl flex items-center justify-center ${item.color} mb-8 group-hover:scale-110 group-hover:${item.glow} transition-all duration-500`}>
                    {item.icon}
                  </div>
                  <p className="text-[10px] font-mono font-black text-text-muted uppercase tracking-[0.2em] mb-3">{item.label}</p>
                  {item.link ? (
                    <a 
                      href={item.link} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-xl font-black text-text-primary hover:text-gradient transition-all break-all"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="text-xl font-black text-text-primary">{item.value}</p>
                  )}
                </div>
              ))}
            </div>
          </AnimatedCard>

          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="glass p-12 rounded-[40px] border border-white/10 inline-block relative group"
            >
              <div className="absolute inset-0 bg-gradient-primary blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity" />
              <h4 className="text-4xl font-black mb-8 text-text-primary">Ready to <span className="text-gradient">Innovate?</span></h4>
              <p className="text-text-secondary text-lg mb-10 max-w-md mx-auto font-medium tracking-wide">
                Drop me a message and let's discuss how we can build something exceptional together.
              </p>
              <GlowButton size="lg" className="px-12" onClick={() => window.open(`mailto:${profile.email}`, '_blank')}>
                Send A Message
              </GlowButton>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
