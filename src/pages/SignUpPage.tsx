import React, { useState } from 'react';
import PhoneSignUp from '../components/auth/PhoneSignUp';

const SignUpPage: React.FC = () => {
  const [method, setMethod] = useState<'email' | 'phone' | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-6 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Créer un compte</h1>
        {!method && (
          <div className="flex flex-col gap-4">
            <button
              className="w-full bg-blue-600 text-white p-2 rounded text-lg"
              onClick={() => setMethod('email')}
            >
              Continuer avec email
            </button>
            <button
              className="w-full bg-green-600 text-white p-2 rounded text-lg"
              onClick={() => setMethod('phone')}
            >
              Continuer avec numéro de téléphone
            </button>
          </div>
        )}
        {method === 'phone' && <PhoneSignUp />}
        {method === 'email' && (
          <div className="text-center mt-4">
            <p>Le formulaire d'inscription par email n'est pas encore implémenté.</p>
            <button
              className="mt-4 text-blue-600 underline"
              onClick={() => setMethod(null)}
            >
              Retour
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignUpPage;
