import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useSupabase } from '../../hooks/useSupabase';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const EmailConfirmedPage: React.FC = () => {
  const location = useLocation();
  // Supabase met l'erreur dans le hash (ex: #error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid+or+has+expired)
  const hash = location.hash;
  const params = new URLSearchParams(hash.replace('#', ''));
  const error = params.get('error');
  const errorDescription = params.get('error_description');

  const [canResend, setCanResend] = React.useState(false);
  const [isResending, setIsResending] = React.useState(false);
  const [resent, setResent] = React.useState(false);
  const [countdown, setCountdown] = React.useState(150); // 2min30 en secondes
  const navigate = useNavigate();
  const { refreshUserProfile } = useSupabase();

  React.useEffect(() => {
    // Après la redirection de confirmation Supabase, le SDK peut inclure la session
    // dans l'URL. Tentez d'extraire la session et de la sauvegarder localement.
    (async () => {
      try {
        // Try to extract and persist the session provided in the redirect URL
        // Newer Supabase SDK exposes getSessionFromUrl(); call it first.
        // Fallback to getSession() if not available.
        // Use a small helper type to avoid linting on `any`.
        type SessionLike = { data?: { session?: { user?: { id: string; email?: string } } } };
        type AuthWithGetter = {
          getSessionFromUrl?: (opts?: { storeSession?: boolean }) => Promise<SessionLike>;
        } & typeof supabase.auth;

        const authWithGetter = supabase.auth as AuthWithGetter;
        if (typeof authWithGetter.getSessionFromUrl === 'function') {
          const result = await authWithGetter.getSessionFromUrl({ storeSession: true });
          if (result?.data?.session?.user) {
            await refreshUserProfile();
            navigate('/complete-profile');
            return;
          }
        }

        // Fallback: check current session
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          await refreshUserProfile();
          navigate('/complete-profile');
        }
      } catch (err) {
        // ignore - we'll keep showing confirmation screen but log for debug
        console.warn('No session available after email confirmation or error parsing URL session:', err);
      }
    })();
  }, [navigate, refreshUserProfile]);

  React.useEffect(() => {
    if (error) {
      setCanResend(false);
      setCountdown(150);
      const interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [error]);

  const handleResend = async () => {
    setIsResending(true);
    // Ici, il faudrait appeler l'API pour renvoyer l'email de confirmation
    await new Promise(r => setTimeout(r, 1200));
    setIsResending(false);
    setResent(true);
  };

  return (
    <div className="min-h-screen bg-grey-50 flex items-center justify-center">
      <div className="bg-white rounded-card shadow-card p-8 max-w-md w-full text-center">
        {error ? (
          <>
            <AlertCircle className="h-16 w-16 text-error-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Lien invalide ou expiré</h1>
            <p className="text-grey-700 mb-4">
              {decodeURIComponent(errorDescription || "Le lien de confirmation est invalide ou a expiré. Vous pouvez demander un nouveau lien ou vous inscrire à nouveau.")}
            </p>
            <Link to="/login" className="btn-primary w-full mb-3">
              Retour à la connexion
            </Link>
            {canResend && !resent && (
              <button className="btn-outline w-full" onClick={handleResend} disabled={isResending}>
                {isResending ? "Envoi en cours..." : "Renvoyer l'email de confirmation"}
              </button>
            )}
            {resent && (
              <div className="text-success-700 mt-2 text-sm">Email de confirmation renvoyé !</div>
            )}
            {!canResend && (
              <div className="text-grey-500 mt-2 text-xs">
                Vous pourrez demander un nouvel email dans {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}.
              </div>
            )}
          </>
        ) : (
          <>
            <CheckCircle2 className="h-16 w-16 text-success mb-4" />
            <h1 className="text-2xl font-bold mb-2">Email confirmé !</h1>
            <p className="text-grey-700 mb-4">
              Votre adresse email a bien été confirmée. Vous pouvez maintenant vous connecter et profiter de DaloaMarket.
            </p>
            <Link to="/login" className="btn-primary w-full">
              Revenir sur DaloaMarket
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default EmailConfirmedPage;
