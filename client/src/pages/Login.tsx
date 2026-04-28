import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import GlowButton from '../components/ui/GlowButton';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await login({ email, password });
      toast.success('Welcome back, Admin!');
      navigate('/admin');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-6 relative">
      {/* Back to Portfolio */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate('/')}
        className="absolute top-10 left-10 flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
      >
        <ArrowLeft size={18} /> Back to Portfolio
      </motion.button>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-black text-gradient mb-3">ADMIN ACCESS</h1>
          <p className="text-text-secondary">Enter your credentials to manage your universe.</p>
        </div>

        <div className="glass-card p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent-primary outline-none transition-colors"
                  placeholder="admin@portfolio.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-text-secondary uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-bg-primary border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:border-accent-primary outline-none transition-colors"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <GlowButton 
              type="submit" 
              className="w-full flex items-center justify-center gap-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : 'AUTHENTICATE'}
            </GlowButton>
          </form>
        </div>
        
        <p className="mt-8 text-center text-text-secondary text-sm">
          Protected with military-grade encryption & JWT protocol.
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
