import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Politique de confidentialité</h1>
          
          <div className="prose max-w-none text-grey-700">
            <h2>Collecte des données</h2>
            <p>Nous collectons uniquement les informations nécessaires à la création de votre compte et à la publication d'annonces (nom, email, téléphone, quartier).</p>
            <h2>Utilisation des données</h2>
            <p>Vos données sont utilisées uniquement pour le fonctionnement de la plateforme. Aucun partage à des tiers, aucun usage commercial externe.</p>
            <h2>Paiement</h2>
            <p>Les paiements sont réalisés manuellement. Aucune donnée bancaire n'est collectée ni stockée par DaloaMarket.</p>
            <h2>Suppression des données</h2>
            <p>Vous pouvez demander la suppression de votre compte et de vos données à tout moment via le support.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;