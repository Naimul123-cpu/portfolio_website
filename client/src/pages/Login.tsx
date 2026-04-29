import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft, ShieldCheck, Cpu } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState(localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(!!localStorage.getItem('rememberedEmail'));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email);
      } else {
        localStorage.removeItem('rememberedEmail');
      }

      toast.success('System Access Authorized.');
      navigate('/system-control');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Protocol Failure: Authentication Rejected');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-base flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Mesh Background Orbs */}
      <div className="aurora-container">
        <div className="aurora-orb orb-1 opacity-20" />
        <div className="aurora-orb orb-2 opacity-20" />
      </div>
      <div className="bg-grid opacity-[0.03]" />

      {/* Floating Geometric Shapes */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            y: [0, -20, 0], 
            rotate: [0, 360],
            opacity: [0.05, 0.1, 0.05]
          } as any}
          transition={{ 
            duration: 10 + i * 2, 
            repeat: Infinity, 
            ease: "linear" 
          } as any}
          className="absolute border border-white/10 pointer-events-none hidden md:block"
          style={{
            width: 40 + i * 20,
            height: 40 + i * 20,
            left: `${15 + i * 15}%`,
            top: `${20 + i * 10}%`,
            borderRadius: i % 2 === 0 ? '12px' : '50%'
          }}
        />
      ))}

      {/* Back to Home */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-text-muted hover:text-text-primary transition-all font-black uppercase tracking-[0.3em] text-[10px] group"
      >
        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> 
        Return to Site
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-primary rounded-[32px] flex items-center justify-center text-white mx-auto mb-8 shadow-glow-violet">
            <ShieldCheck size={40} />
          </div>
          <h1 className="text-5xl font-display font-black tracking-tighter mb-4">
            <span className="text-gradient">WELCOME</span>
            <span className="text-text-primary ml-2">BACK</span>
          </h1>
          <p className="text-text-muted font-medium uppercase tracking-widest text-[10px]">Secure Authentication Required</p>
        </div>

        <div className="relative group">
          {/* Card Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-accent-violet/20 to-accent-cyan/20 rounded-[40px] blur-2xl opacity-50" />
          
          <div className="relative glass p-10 md:p-14 rounded-[40px] border border-white/5 shadow-2xl overflow-hidden">
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 ml-1">
                  Access Identifier
                </label>
                <div className="relative group/input">
                  <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-accent-violet transition-colors" size={20} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 focus:border-accent-violet/50 outline-none transition-all placeholder:text-text-muted/30 font-medium text-text-primary"
                    placeholder="admin@naim.dev"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-text-muted uppercase tracking-[0.3em] mb-4 ml-1">
                  Security Passkey
                </label>
                <div className="relative group/input">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-text-muted group-focus-within/input:text-accent-violet transition-colors" size={20} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-5 pl-14 pr-6 focus:border-accent-violet/50 outline-none transition-all placeholder:text-text-muted/30 font-medium text-text-primary"
                    placeholder="••••••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group/check">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-6 h-6 rounded-lg border transition-all flex items-center justify-center ${rememberMe ? 'bg-accent-violet border-accent-violet' : 'bg-white/5 border-white/10 group-hover/check:border-accent-violet/50'}`}>
                      {rememberMe && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2.5 h-2.5 bg-white rounded-sm" />}
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-text-muted uppercase tracking-widest transition-colors group-hover/check:text-text-primary">Keep Session Alive</span>
                </label>
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="group relative w-full py-5 bg-gradient-primary rounded-2xl font-black text-[11px] tracking-[0.3em] uppercase overflow-hidden transition-all hover:scale-[1.02] active:scale-[0.98] shadow-glow-violet disabled:opacity-50"
              >
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-3">
                  {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE SYSTEM'}
                </span>
              </button>
            </form>
          </div>
        </div>
        
        <div className="mt-12 flex items-center justify-center gap-6 opacity-30">
          <div className="flex items-center gap-2">
            <Cpu size={14} className="text-text-muted" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em]">Secure Node</span>
          </div>
          <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
          <span className="text-[9px] font-black uppercase tracking-[0.2em]">v2.4.0 Authorized</span>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
