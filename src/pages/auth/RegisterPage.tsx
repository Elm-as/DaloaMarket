import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Mail, Lock, AlertCircle } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import PhoneSignUp from '../../components/auth/PhoneSignUp';

interface RegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
}

const RegisterPage: React.FC = () => {
  const { signUp } = useSupabase();
  const [isLoading, setIsLoading] = useState(false);
  const [showEmailNotice, setShowEmailNotice] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);

  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<RegisterFormData>();
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // Vérification préventive dans la table users
      const { data: existingUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', data.email)
        .single();
      if (existingUser) {
        toast.error("Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.");
        setIsLoading(false);
        return;
      }
  // Si pas trouvé, on tente l'inscription
  const res = await signUp(data.email, data.password);
  const error = res.error;
  const requiresConfirmation = res.requiresConfirmation ?? false;
  if (error) {
        // Log pour debug++++++
        console.error('Supabase signup error:', error);
        let msg = '';
        if (typeof error === 'object' && error !== null) {
          if ('message' in error) msg = String(error.message).toLowerCase();
          if ('code' in error) msg += ' ' + String(error.code).toLowerCase();
        } else {
          msg = String(error).toLowerCase();
        }
        // On élargit la détection à tous les cas connus
        if (
          msg.includes('email') && (msg.includes('existe') || msg.includes('déjà') || msg.includes('used') || msg.includes('duplicate') || msg.includes('already'))
          || msg.includes('auth/duplicate-email')
          || msg.includes('auth/email-already-exists')
          || msg.includes('duplicate key')
        ) {
          toast.error("Cet email est déjà utilisé. Veuillez vous connecter ou utiliser un autre email.");
        } else {
          toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
        }
        // If the error mentions a missing refresh token, provide a clearer action
        if (String(msg).includes('refresh_token') || String(msg).includes('refresh token')) {
          setErrorMessage('Inscription partielle détectée. Vérifiez votre email pour confirmer votre compte, puis reconnectez-vous.');
        }
        return;
      }
      // If Supabase returned no session, the user must confirm email first
      if (requiresConfirmation) {
        toast.success('Inscription reçue — vérifiez votre boîte mail pour confirmer votre adresse.');
        setShowEmailNotice(true);
      } else {
        // In some configurations, signUp can return an active session. In that case keep the same behaviour but still show notice
        toast.success('Inscription réussie ! Vous êtes connecté(e).');
        setShowEmailNotice(true);
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error("Erreur lors de l'inscription. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-grey-50 py-12">
      <div className="container-custom max-w-md">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold text-center mb-6">Créer un compte</h1>
          {!method && (
            <div className="flex flex-col gap-4 mb-6">
              <button
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-lg shadow transition-all duration-150"
                style={{ letterSpacing: 0.5 }}
                onClick={() => setMethod('email')}
              >
                Continuer avec email
              </button>
              <button
                className="w-full bg-black hover:bg-gray-900 text-white font-bold py-3 rounded-xl text-lg shadow transition-all duration-150"
                style={{ letterSpacing: 0.5 }}
                onClick={() => setMethod('phone')}
              >
                Continuer avec numéro de téléphone
              </button>
            </div>
          )}
          {method === 'email' && (
            <>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {errorMessage && (
                  <div className="text-error-500 text-sm mb-2 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                      {errorMessage}
                  </div>
                )}
                <div>
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      type="email"
                      className={`input-field pl-10 ${errors.email ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="votre@email.com"
                      {...register('email', { 
                        required: 'L\'email est requis',
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: 'Adresse email invalide'
                        }
                      })}
                      disabled={isLoading}
                    />
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-grey-400" />
                  </div>
                  {errors.email && (
                    <p className="input-error flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.email.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="password" className="input-label">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type="password"
                      className={`input-field pl-10 ${errors.password ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="••••••••"
                      {...register('password', { 
                        required: 'Le mot de passe est requis',
                        minLength: {
                          value: 6,
                          message: 'Le mot de passe doit contenir au moins 6 caractères'
                        }
                      })}
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-grey-400" />
                  </div>
                  {errors.password && (
                    <p className="input-error flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.password.message}
                    </p>
                  )}
                </div>
                <div>
                  <label htmlFor="confirmPassword" className="input-label">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type="password"
                      className={`input-field pl-10 ${errors.confirmPassword ? 'border-error-500 focus:ring-error-500 focus:border-error-500' : ''}`}
                      placeholder="••••••••"
                      {...register('confirmPassword', { 
                        required: 'Veuillez confirmer votre mot de passe',
                        validate: value => value === password || 'Les mots de passe ne correspondent pas'
                      })}
                      disabled={isLoading}
                    />
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-grey-400" />
                  </div>
                  {errors.confirmPassword && (
                    <p className="input-error flex items-center mt-1">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      {errors.confirmPassword.message}
                    </p>
                  )}
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex justify-center items-center"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <LoadingSpinner size="small" className="text-white" />
                  ) : (
                    'S\'inscrire'
                  )}
                </button>
              </form>
              {showEmailNotice && (
                <div className="bg-info-50 border-l-4 border-info-500 p-4 mb-6 text-info-900">
                  <p className="font-semibold mb-1">Vérification de l'email requise</p>
                  <p>Un email de confirmation vient de vous être envoyé. Merci de cliquer sur le lien reçu pour activer votre compte.</p>
                </div>
              )}
              <div className="mt-6 text-center">
                <p className="text-grey-600">
                  Vous avez déjà un compte ?{' '}
                  <Link to="/login" className="text-primary font-medium hover:underline">
                    Se connecter
                  </Link>
                </p>
                <button
                  className="mt-4 text-orange-500 hover:underline font-semibold"
                  onClick={() => setMethod('phone')}
                >
                  Continuer avec numéro de téléphone
                </button>
              </div>
            </>
          )}
          {method === 'phone' && (
            <PhoneSignUp onSwitchToEmail={() => setMethod('email')} />
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;

// Modernisation UI/UX :
// - Formulaires : champs arrondis, labels, focus, erreurs
// - Boutons : classes utilitaires, transitions, feedback
// - Feedback visuel : loaders, messages
// - Responsive : paddings, tailles de texte
// - Accessibilité : focus visible, aria-labels