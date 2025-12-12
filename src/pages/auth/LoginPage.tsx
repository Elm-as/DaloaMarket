import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSupabase } from '../../hooks/useSupabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Mascot from '../../components/auth/Mascot';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  from?: { pathname?: string };
}

const LoginPage: React.FC = () => {
  const { signIn } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const [mascotReaction, setMascotReaction] = useState<'float' | 'bounce' | 'wave' | 'blink' | 'thinking'>('float');
  const [showPassword, setShowPassword] = useState(false);
  const from = (location.state as LocationState)?.from?.pathname || '/';
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setMascotReaction('bounce');
    try {
      const { error } = await signIn(data.email, data.password);
      if (error) throw error;
      setMascotReaction('wave');
      toast.success('Connexion réussie');
      setTimeout(() => navigate(from, { replace: true }), 900);
    } catch (err) {
      const error = err as Error;
      setMascotReaction('blink');
      let msg = error.message || 'Erreur de connexion';
      if (msg.includes('Invalid login credentials')) msg = 'Identifiants incorrects.';
      toast.error(msg);
      setTimeout(() => setMascotReaction('float'), 2500);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-primary-200 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-secondary-200 rounded-full blur-xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-100 rounded-full blur-2xl" />
      </div>

      <motion.div className="container-custom max-w-md relative z-10" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
        <motion.div className="flex justify-center mb-6" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}>
          <Mascot type={isLoading ? 'excited' : 'happy'} size={100} reaction={mascotReaction} passwordState={showPassword ? 'visible' : 'hidden'} />
        </motion.div>

        <motion.div className="bg-white/80 backdrop-blur-sm rounded-card shadow-card p-6 md:p-8 border border-white/20" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
          <motion.h1 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>Bienvenue !</motion.h1>

          <motion.form onSubmit={handleSubmit(onSubmit)} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.6 }}>
              <label htmlFor="email" className="input-label">Email</label>
              <div className="relative">
                <input id="email" type="email" className={`input-field pl-10 transition-all duration-300 ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`} placeholder="votre@email.com" {...register('email', { required: 'L\'email est requis', pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: 'Adresse email invalide' } })} disabled={isLoading} />
                <Mail className="absolute left-3 top-3.5 h-5 w-5 text-grey-400 transition-colors" />
              </div>
              {errors.email && (<motion.p className="input-error flex items-center mt-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><AlertCircle className="h-4 w-4 mr-1" />{errors.email.message}</motion.p>)}
            </motion.div>

            <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.7 }}>
              <label htmlFor="password" className="input-label">Mot de passe</label>
              <div className="relative">
                <input id="password" type={showPassword ? 'text' : 'password'} className={`input-field pl-10 pr-10 transition-all duration-300 ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`} placeholder="••••••••" {...register('password', { required: 'Le mot de passe est requis', minLength: { value: 6, message: 'Le mot de passe doit contenir au moins 6 caractères' } })} disabled={isLoading} />
                <Lock className="absolute left-3 top-3.5 h-5 w-5 text-grey-400 transition-colors" />

                <button type="button" aria-pressed={showPassword} aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'} onClick={() => { setShowPassword((s) => !s); if (!showPassword) { setMascotReaction('blink'); setTimeout(() => setMascotReaction('wave'), 120); } else { setMascotReaction('thinking'); setTimeout(() => setMascotReaction('float'), 700); } }} className="absolute right-3 top-3.5 h-6 w-6 flex items-center justify-center text-grey-500 hover:text-grey-700">
                  {showPassword ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 5c4.97 0 9 4.03 9 7s-4.03 7-9 7-9-4.03-9-7 4.03-7 9-7m0-2C7.03 3 2 7.03 2 12s5.03 9 10 9 10-5.03 10-9S16.97 3 12 3z"/></svg> : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="h-4 w-4"><path fill="currentColor" d="M12 6.5C8.69 6.5 5.84 8.36 4 11.5c1.84 3.14 4.69 5 8 5s6.16-1.86 8-5c-1.84-3.14-4.69-5-8-5m0-2c5.25 0 9.75 3.58 11.99 8.38a1 1 0 0 1 0 .24C21.75 17.42 17.25 21 12 21s-9.75-3.58-11.99-8.38a1 1 0 0 1 0-.24C2.25 8.08 6.75 4.5 12 4.5z"/></svg>}
                </button>
              </div>
              {errors.password && (<motion.p className="input-error flex items-center mt-1" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}><AlertCircle className="h-4 w-4 mr-1" />{errors.password.message}</motion.p>)}
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
              <Link to="/auth/reset-password" className="text-sm text-primary hover:underline transition-colors">Mot de passe oublié ?</Link>
            </motion.div>

            <motion.button type="submit" className="btn-primary w-full flex justify-center items-center transform hover:scale-105 transition-all duration-200" disabled={isLoading} initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              {isLoading ? <LoadingSpinner size="small" className="text-white" /> : 'Se connecter'}
            </motion.button>
          </motion.form>

          <motion.div className="mt-6 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
            <p className="text-grey-600">Vous n'avez pas de compte ?{' '}<Link to="/register" className="text-primary font-medium hover:underline transition-colors">S'inscrire</Link></p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LoginPage;