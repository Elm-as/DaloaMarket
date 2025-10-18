import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8">
          <h1 className="text-2xl font-bold mb-6">Conditions d'utilisation</h1>
          
          <div className="prose max-w-none text-grey-700">
            <div className="mb-6 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded">
              ⚠️ Daloa Market est actuellement en <strong>phase de test (version bêta)</strong>.<br />
              Cette plateforme évolue rapidement grâce à vos retours. Certaines fonctionnalités ou conditions peuvent changer sans préavis.<br />
              <strong>Aucune structure juridique formelle n’est encore créée.</strong> L’activité reste à petite échelle et s’adapte selon les retours des utilisateurs.
            </div>
            
            <p>
              Bienvenue sur DaloaMarket. En utilisant notre plateforme, vous acceptez les présentes conditions d'utilisation. Veuillez les lire attentivement.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">1. Acceptation des conditions</h2>
            <p>
              En accédant à DaloaMarket, vous acceptez d'être lié par ces conditions d'utilisation, toutes les lois et réglementations applicables, et vous acceptez que vous êtes responsable du respect des lois locales applicables. Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser ce site.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">2. Inscription et compte</h2>
            <p>
              Pour utiliser certaines fonctionnalités de DaloaMarket, vous devez créer un compte. Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe et de restreindre l'accès à votre ordinateur. Vous acceptez d'assumer la responsabilité de toutes les activités qui se produisent sous votre compte.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">3. Publication d'annonces</h2>
            <p>
              Pour publier une annonce sur DaloaMarket, vous devez disposer d'un crédit ou payer l'annonce à l'unité (200 FCFA) par paiement manuel. Il n'y a plus de système de boost ou de mise en avant payante.<br />
              En publiant une annonce, vous garantissez que :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Vous êtes le propriétaire légitime de l'article ou autorisé à le vendre</li>
              <li>L'article est légal à vendre en Côte d'Ivoire</li>
              <li>Les informations fournies sont exactes et complètes</li>
              <li>Les photos téléchargées représentent fidèlement l'article vendu</li>
              <li>Vous respectez toutes les lois et réglementations applicables</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">4. Articles interdits</h2>
            <p>
              Les articles suivants sont interdits sur DaloaMarket :
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Produits illégaux ou contrefaits</li>
              <li>Armes, explosifs et matériel dangereux</li>
              <li>Drogues, médicaments sur ordonnance et substances contrôlées</li>
              <li>Produits à caractère pornographique</li>
              <li>Animaux vivants</li>
              <li>Services illégaux ou contraires à l'éthique</li>
              <li>Tout autre article interdit par la loi ivoirienne</li>
            </ul>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">5. Crédits, frais et paiements</h2>
            <h2>1. Fonctionnement général</h2>
            <p>DaloaMarket est une plateforme de mise en relation entre particuliers pour l'achat et la vente d'articles d'occasion à Daloa. Les utilisateurs peuvent publier des annonces en utilisant des crédits. Le paiement de la publication se fait manuellement après création de l'annonce. Il n'y a plus de boost ni de paiement automatique.</p>
            <h2>2. Crédits</h2>
            <p>Les crédits servent uniquement à publier des annonces. Ils sont achetés manuellement via les moyens de paiement proposés (Mobile Money, etc.). Aucun crédit n'est remboursé en cas de suppression d'annonce.</p>
            <h2>3. Paiement</h2>
            <p>Le paiement des crédits et des annonces se fait uniquement de façon manuelle. Aucune transaction automatique n'est effectuée par la plateforme. Les transactions entre acheteurs et vendeurs se font en personne, sans intervention de DaloaMarket.</p>
            <h2>4. Suppression des boosts</h2>
            <p>La fonctionnalité de boost d'annonce a été retirée. Toutes les annonces sont affichées de façon équitable.</p>
            <h2>5. Responsabilité</h2>
            <p>DaloaMarket n'est pas responsable des transactions entre utilisateurs. Les utilisateurs doivent rester vigilants lors des échanges.</p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">6. Transactions entre utilisateurs</h2>
            <p>
              DaloaMarket est une plateforme qui met en relation acheteurs et vendeurs. Nous ne sommes pas partie aux transactions entre utilisateurs et n'assumons aucune responsabilité pour les problèmes pouvant survenir lors de ces transactions. Nous recommandons aux utilisateurs de prendre les précautions nécessaires lors des rencontres en personne et des échanges d'argent.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">7. Propriété intellectuelle</h2>
            <p>
              Le contenu de DaloaMarket, y compris les textes, graphiques, logos, images, ainsi que leur compilation, est la propriété de DaloaMarket et est protégé par les lois sur le droit d'auteur et la propriété intellectuelle. Vous ne pouvez pas reproduire, dupliquer, copier, vendre, revendre ou exploiter une partie du service sans autorisation expresse écrite.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">8. Limitation de responsabilité</h2>
            <p>
              DaloaMarket ne garantit pas que le service sera ininterrompu, opportun, sécurisé ou sans erreur. DaloaMarket ne sera pas responsable des dommages directs, indirects, accessoires, spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">9. Modifications des conditions</h2>
            <p>
              DaloaMarket se réserve le droit de modifier ces conditions d'utilisation à tout moment. Les modifications entrent en vigueur dès leur publication sur le site. Il est de votre responsabilité de consulter régulièrement ces conditions.
            </p>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">10. Loi applicable</h2>
            <p>
              Ces conditions sont régies par les lois de la République de Côte d'Ivoire. Tout litige relatif à l'utilisation de DaloaMarket sera soumis à la compétence exclusive des tribunaux d'Abidjan.
            </p>
            
            <p className="mt-8">
              Date de dernière mise à jour : 11 Août 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;