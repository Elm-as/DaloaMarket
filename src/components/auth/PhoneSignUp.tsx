import React, { useState } from 'react';
import { supabase } from '../../lib/supabase';


interface PhoneSignUpProps {
  onSwitchToEmail?: () => void;
}

const PhoneSignUp: React.FC<PhoneSignUpProps> = ({ onSwitchToEmail }) => {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'success'>('phone');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  // Formate un numéro local ivoirien en E.164 (+225...)
  function formatToE164(number: string) {
    let n = number.replace(/\D/g, '');
    if (n.startsWith('0')) n = n.slice(1);
    return '+225' + n;
  }

  // Envoi de l'OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formattedPhone = formatToE164(phone);
    const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep('otp');
    }
  };

  // Vérification de l'OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' });
    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      setStep('success');
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded shadow">
      {step === 'phone' && (
        <form onSubmit={handleSendOtp}>
          <h2 className="text-xl font-bold mb-4 text-black">Inscription par téléphone</h2>
          <input
            type="tel"
            placeholder="Ex: 0XXXXXXXXX"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            className="w-full border-2 border-black focus:border-orange-500 focus:ring-orange-500 p-2 rounded mb-2 text-black text-lg font-medium placeholder-gray-400"
            required
          />
          <div className="text-xs text-gray-500 mb-2">
            Vous pouvez entrer votre numéro ivoirien au format local (ex : <span className='font-semibold'>0XXXXXXXXX</span>)<br />
            Il sera automatiquement converti en <span className="font-semibold">+225XXXXXXXXX</span> pour l'envoi du SMS.
          </div>
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded font-bold transition"
            disabled={loading}
          >
            {loading ? 'Envoi...' : 'Envoyer le code'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
      {step === 'otp' && (
        <form onSubmit={handleVerifyOtp}>
          <h2 className="text-xl font-bold mb-4 text-black">Vérification du code</h2>
          <input
            type="text"
            placeholder="Code OTP reçu"
            value={otp}
            onChange={e => setOtp(e.target.value)}
            className="w-full border-2 border-black focus:border-orange-500 focus:ring-orange-500 p-2 rounded mb-2 text-black"
            required
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white p-2 rounded font-bold transition"
            disabled={loading}
          >
            {loading ? 'Vérification...' : 'Vérifier le code'}
          </button>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
      )}
      {step === 'success' && (
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4 text-black">Inscription réussie !</h2>
          <p className="text-black">Votre compte a été créé avec succès.</p>
        </div>
      )}
      {onSwitchToEmail && step === 'phone' && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-orange-500 hover:underline font-semibold"
            onClick={onSwitchToEmail}
          >
            Continuer avec email
          </button>
        </div>
      )}
      {onSwitchToEmail && step === 'otp' && (
        <div className="mt-6 text-center">
          <button
            type="button"
            className="text-orange-500 hover:underline font-semibold"
            onClick={() => { setStep('phone'); setOtp(''); setError(null); }}
          >
            Modifier le numéro
          </button>
        </div>
      )}
    </div>
  );
};

export default PhoneSignUp;
