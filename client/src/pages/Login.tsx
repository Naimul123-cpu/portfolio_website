import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/ui/GlowButton';

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

      toast.success('Access granted. Welcome back.');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-accent-violet/10 blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent-cyan/10 blur-[120px]" />

      {/* Back to Portfolio */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-text-secondary hover:text-accent-violet transition-colors font-bold uppercase tracking-widest text-xs"
      >
        <ArrowLeft size={16} /> Back to Portfolio
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-5xl font-display font-black text-gradient mb-4 tracking-tighter">SECURE LOGIN</h1>
          <p className="text-text-secondary font-light">Enter the portal to manage your digital universe.</p>
        </div>

        <div className="glass-card p-10 border-accent-violet/20 shadow-2xl shadow-accent-violet/5">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-3 ml-1">
                Admin Identifier
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-violet transition-colors" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent-violet outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="admin@naim.dev"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] mb-3 ml-1">
                Security Key
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary group-focus-within:text-accent-violet transition-colors" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:border-accent-violet outline-none transition-all placeholder:text-text-secondary/30"
                  placeholder="••••••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between px-1">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${rememberMe ? 'bg-accent-violet border-accent-violet' : 'border-white/20 group-hover:border-accent-violet/50'}`}>
                    {rememberMe && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>
                <span className="text-xs font-bold text-text-secondary uppercase tracking-widest transition-colors group-hover:text-text-primary">Remember Identifier</span>
              </label>
            </div>

            <GlowButton 
              type="submit" 
              className="w-full py-4 flex items-center justify-center gap-3 text-sm font-black tracking-[0.2em]"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'INITIALIZE SESSION'}
            </GlowButton>
          </form>
        </div>
        
        <div className="mt-10 flex flex-col items-center gap-4">
          <p className="text-text-secondary text-[10px] uppercase tracking-[0.2em] font-bold flex items-center gap-2">
            <span className="w-8 h-px bg-white/10"></span>
            End-to-end Encrypted
            <span className="w-8 h-px bg-white/10"></span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
