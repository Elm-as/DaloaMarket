import React from 'react';

const BannedPage: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-grey-50">
    <div className="bg-white rounded-card shadow-card p-8 text-center">
      <h1 className="text-3xl font-bold mb-4 text-error-600">Compte suspendu</h1>
      <p className="text-grey-700">Votre compte a été suspendu. Contactez le support si vous pensez qu'il s'agit d'une erreur.</p>
    </div>
  </div>
);

export default BannedPage;
