
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSupabase } from '../hooks/useSupabase';

const HowItWorksPage: React.FC = () => {
  const { user } = useSupabase();
  const navigate = useNavigate();

  // Handler pour le lien "Acheter des crédits" : redirige vers login si non connecté
  const handleCreditsClick = (e: React.MouseEvent) => {
    if (!user) {
      e.preventDefault();
      navigate('/login', { replace: true, state: { from: '/acheter-credits' } });
    }
  };

  return (
    <div className="min-h-screen bg-grey-50 py-10">
      <div className="container-custom max-w-2xl bg-white rounded-card shadow-card p-8">
        <h1 className="text-3xl font-bold mb-4">Comment ça marche ?</h1>
        <ol className="space-y-8 mt-8">
          <li>
            <h2 className="text-xl font-semibold mb-2">1. Créez votre annonce</h2>
            <p className="text-grey-700">Prenez des photos, décrivez votre article, fixez votre prix et publiez. Le paiement de la publication se fait manuellement après création. Vous pouvez ajouter plusieurs photos pour attirer plus d’acheteurs.</p>
          </li>
          <li>
            <h2 className="text-xl font-semibold mb-2">2. Discutez avec les acheteurs</h2>
            <p className="text-grey-700">Recevez des messages et répondez via notre messagerie sécurisée. Pas de boost, pas de paiement automatique. Vous pouvez négocier, poser des questions et convenir d’un rendez-vous.</p>
          </li>
          <li>
            <h2 className="text-xl font-semibold mb-2">3. Vendez en toute simplicité</h2>
            <p className="text-grey-700">Rencontrez l’acheteur dans votre quartier en toute sécurité. Le paiement se fait directement entre vous et l’acheteur, sans intermédiaire.</p>
          </li>
        </ol>
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2">Conseils pour réussir vos ventes</h2>
          <ul className="list-disc pl-6 text-grey-700 space-y-2">
            <li>Ajoutez des photos claires et récentes de votre article.</li>
            <li>Décrivez précisément l’état, la marque, la taille, etc.</li>
            <li>Répondez rapidement aux messages pour ne pas rater une vente.</li>
            <li>Privilégiez les lieux publics pour les rendez-vous.</li>
            <li>Ne partagez jamais vos informations sensibles.</li>
          </ul>
        </div>
        <div className="mt-10">
          <h2 className="text-lg font-bold mb-2">Questions fréquentes</h2>
          <ul className="list-disc pl-6 text-grey-700 space-y-2">
            <li>
              Comment acheter des crédits&nbsp;?{' '}
              <span className="text-grey-500">
                <Link 
                  to="/acheter-credits" 
                  onClick={handleCreditsClick}
                  className="text-primary underline hover:text-primary-700 font-medium"
                >
                  Accéder à la page "Acheter des crédits"
                </Link>
                {" "}(dans votre profil)
              </span>
            </li>
            <li>
              Comment signaler un utilisateur&nbsp;?{' '}
              <span className="text-grey-500">Utilisez le bouton "Signaler" sur le profil ou la conversation.</span>
            </li>
            <li>
              Que faire en cas de problème&nbsp;?{' '}
              <span className="text-grey-500">
                <Link 
                  to="/help"
                  className="text-primary underline hover:text-primary-700 font-medium"
                >
                  Contactez le support via la page Aide
                </Link>
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
