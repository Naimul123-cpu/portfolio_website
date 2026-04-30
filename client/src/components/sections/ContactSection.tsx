import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle, ChevronRight, Globe } from 'lucide-react';
import SectionTitle from '../ui/SectionTitle';
import type { IProfile } from '../../types';

interface ContactSectionProps {
  profile: IProfile | null;
}

const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  if (!profile) return null;

  const contactItems = [
    { 
      icon: <Mail size={24} />, 
      label: 'Direct Protocol', 
      value: profile.email, 
      link: `mailto:${profile.email}`,
      color: 'accent-violet'
    },
    { 
      icon: <Phone size={24} />, 
      label: 'Voice Uplink', 
      value: profile.phone, 
      link: `tel:${profile.phone}`,
      color: 'accent-cyan'
    },
    { 
      icon: <MessageCircle size={24} />, 
      label: 'Secure WhatsApp', 
      value: profile.whatsapp, 
      link: `https://wa.me/${profile.whatsapp?.replace(/\D/g, '')}`,
      color: 'accent-pink'
    },
    { 
      icon: <MapPin size={24} />, 
      label: 'Base Station', 
      value: profile.presentAddress, 
      color: 'accent-blue'
    },
  ].filter(item => item.value);

  return (
    <section id="contact" className="py-32 relative overflow-hidden">
      {/* Background Decorative Illustrations */}
      <div className="absolute top-1/4 right-0 p-20 opacity-[0.03] pointer-events-none rotate-45">
        <Send size={300} />
      </div>
      <div className="absolute bottom-1/4 left-0 p-20 opacity-[0.03] pointer-events-none -rotate-12">
        <Globe size={300} />
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <SectionTitle 
          eyebrow="COMMUNICATION"
          title="Initialize <Integration>" 
          subtitle="Ready to discuss large-scale infrastructure or specialized engineering consultancy? Let's connect."
        />
        
        <div className="grid lg:grid-cols-12 gap-16 max-w-7xl mx-auto items-center">
          {/* Left Side: Call to Action */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <h3 className="text-3xl sm:text-5xl md:text-6xl font-display font-black text-text-primary leading-[1.1] mb-8">
              Let's build something <span className="text-gradient-aurora">Enduring</span>.
            </h3>
            <p className="text-text-secondary text-base md:text-lg font-medium leading-relaxed mb-10 opacity-70">
              I'm always looking for ambitious projects and technical challenges. Whether it's a structural audit or a full-scale development, I'm ready to contribute my expertise.
            </p>
            
            <div className="flex gap-4">
              <div className="w-12 h-12 glass rounded-2xl flex items-center justify-center text-accent-violet">
                <Send size={24} />
              </div>
              <div className="text-text-primary">
                <p className="text-[10px] font-black uppercase tracking-widest text-accent-violet">Response Time</p>
                <p className="text-lg font-black tracking-tight">Within 24 Hours</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side: Contact Cards */}
          <div className="lg:col-span-7 grid sm:grid-cols-2 gap-6">
            {contactItems.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.6, 
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                whileHover={{ y: -10, scale: 1.02, transition: { duration: 0.3 } }}
                className="group relative"
              >
                {/* Glow Effect */}
                <div className={`absolute -inset-1 bg-${item.color} rounded-[32px] blur-xl opacity-0 group-hover:opacity-20 transition-opacity`} />
                
                <div className="relative glass-card glass-card-hover p-8 rounded-[32px] bg-white/[0.02] h-full flex flex-col">
                  <div className={`w-14 h-14 glass rounded-2xl flex items-center justify-center text-${item.color} mb-8 shadow-2xl border-white/5`}>
                    {item.icon}
                  </div>
                  
                  <div className="flex-grow">
                    <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-3">{item.label}</p>
                    {item.link ? (
                      <a 
                        href={item.link} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-xl font-black text-text-primary group-hover:text-gradient transition-all break-all tracking-tighter"
                      >
                        {item.value}
                      </a>
                    ) : (
                      <p className="text-xl font-black text-text-primary tracking-tighter">{item.value}</p>
                    )}
                  </div>
                  
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                    <span className="text-[9px] font-black uppercase tracking-widest text-text-muted">Protocol Active</span>
                    <ChevronRight size={16} className={`text-${item.color} opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all`} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
