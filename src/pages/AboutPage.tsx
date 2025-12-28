import React from 'react';


const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-grey-50 py-10">
    <div className="container-custom max-w-2xl bg-white rounded-card shadow-card p-8">
      <h1 className="text-3xl font-bold mb-4">À propos de Daloa Market</h1>
      <p className="mb-4">
        <strong>Daloa Market</strong> est une plateforme locale permettant aux habitants de Daloa, notamment les étudiants, de vendre et d’acheter facilement des objets d’occasion entre eux.<br />
        Le projet est actuellement en <span className="text-orange-600 font-semibold">phase de test (bêta)</span> à l’université de Daloa, avant un lancement officiel plus large.<br />
        <span className="font-semibold">Il n'y a plus de système de boost ni de paiement automatique.</span> Toutes les publications d'annonces se font par crédit ou paiement manuel à l'unité (200 FCFA/annonce).
      </p>
      <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-500 text-orange-800 rounded">
        ⚠️ <strong>Phase de test</strong> : la plateforme évolue rapidement grâce à vos retours. Certaines fonctionnalités ou conditions peuvent changer sans préavis.<br />
        <strong>Aucune structure juridique formelle n’est encore créée.</strong> L’activité reste à petite échelle et s’adapte selon les retours des utilisateurs.
      </div>
      <div className="mb-8 text-sm text-grey-600">
        Pour toute question sur la confidentialité, les conditions ou le fonctionnement, consultez aussi les pages <a href="/faq" className="text-primary underline">FAQ</a>, <a href="/help" className="text-primary underline">Aide</a>, <a href="/terms" className="text-primary underline">Conditions</a> et <a href="/privacy" className="text-primary underline">Confidentialité</a>.<br />
        <span className="font-semibold">Contact officiel :</span> <a href="mailto:support@daloamarket.shop" className="text-primary underline">support@daloamarket.shop</a>
      </div>
      <div className="mb-8">
        <a
          href="https://wa.me/2250788000831"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.21 5.077 4.377.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.591.418 3.086 1.144 4.375L3 21l4.755-1.244A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
          </svg>
          Contacter le support WhatsApp
        </a>
      </div>
      <h2 className="text-2xl font-bold mt-8 mb-4">À propos du créateur</h2>
      <p className="mb-4">
        Je m'appelle Elmas Oulobo, étudiant en L3 Économie, passionné de programmation et de développement web.<br />
        Ce projet est développé sans budget, uniquement avec ma connexion et ma détermination, pour aider la communauté locale.
      </p>
      <p className="mb-8">Merci à tous ceux qui soutiennent cette initiative locale 🙏</p>
      
      <h2 className="text-2xl font-bold mt-8 mb-4">Mes projets</h2>
      
      {/* Project 1: KlasNet */}
      <div className="mb-6 p-4 border border-grey-200 rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary">Projet 1 : KlasNet</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Complété</span>
        </div>
        <p className="text-sm text-grey-600 mb-2 font-semibold">Logiciel de Gestion Scolaire - École Primaire Côte d'Ivoire</p>
        <a 
          href="https://drive.google.com/file/d/1rj92hBaOWI9DgKegJKc76UOMW13kFDYk/view?usp=drive_link"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-600 text-sm mb-3 inline-block"
        >
          → Voir la démo
        </a>
        <p className="mb-3 text-grey-700">
          Application web complète de gestion scolaire spécialement conçue pour les écoles primaires ivoiriennes. 
          Le système gère tous les aspects administratifs : élèves, enseignants, classes, matières, finances, notes et bulletins.
        </p>
        <div className="mb-3">
          <h4 className="font-semibold mb-2">✨ Fonctionnalités Principales :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-grey-700 ml-2">
            <li><strong>Gestion des Élèves</strong> : Inscription avec matricule automatique, upload de photos, import/export Excel</li>
            <li><strong>Gestion des Enseignants</strong> : Profils complets, assignation aux classes, suivi des salaires</li>
            <li><strong>Gestion des Classes</strong> : Configuration par niveau (CP1, CP2, CE1, CE2, CM1, CM2)</li>
            <li><strong>Système Financier</strong> : Suivi des paiements, génération de reçus automatiques, dashboard financier</li>
            <li><strong>Système de Notes</strong> : Saisie par compositions (système ivoirien), calcul automatique des moyennes, génération de bulletins PDF</li>
            <li><strong>Système de Licence Avancé</strong> : Fonctionnement hors ligne, protection anti-triche, types de licences multiples</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">🔧 Technologies :</h4>
          <p className="text-sm text-grey-700">React 18 + TypeScript, Tailwind CSS, Vite, Local Storage</p>
        </div>
      </div>

      {/* Project 2: DaloaMarket */}
      <div className="mb-6 p-4 border border-grey-200 rounded-lg hover:shadow-lg transition-shadow bg-orange-50">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary">Projet 2 : DaloaMarket</h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">🚀 En cours</span>
        </div>
        <p className="text-sm text-grey-600 mb-2 font-semibold">Application mobile React Native - Première Marketplace P2P de Daloa</p>
        <p className="mb-3 text-grey-700">
          Application mobile React Native pour DaloaMarket, la première marketplace P2P de Daloa. 
          Permet aux habitants de Daloa, notamment les étudiants, de vendre et d'acheter facilement des objets d'occasion entre eux.
        </p>
        <div className="mb-3">
          <h4 className="font-semibold mb-2">🚀 Fonctionnalités :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-grey-700 ml-2">
            <li><strong>Authentification</strong> : Inscription, connexion avec Supabase</li>
            <li><strong>Annonces</strong> : Création, recherche, filtrage d'annonces</li>
            <li><strong>Messagerie</strong> : Chat en temps réel entre utilisateurs</li>
            <li><strong>Profil</strong> : Gestion du profil utilisateur</li>
            <li><strong>Paiements</strong> : Intégration PayDunya pour les frais de publication</li>
            <li><strong>Photos</strong> : Upload d'images via caméra ou galerie</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">📱 Technologies :</h4>
          <p className="text-sm text-grey-700">React Native avec Expo, TypeScript, Supabase, NativeWind (Tailwind CSS), Expo Router</p>
        </div>
      </div>

      {/* Project 3: Medico-Dict */}
      <div className="mb-6 p-4 border border-grey-200 rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary">Projet 3 : Medico-Dict</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Complété</span>
        </div>
        <p className="text-sm text-grey-600 mb-2 font-semibold">Dictionnaire Médical avec +450 maladies</p>
        <a 
          href="https://medico-dict.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary underline hover:text-primary-600 text-sm mb-3 inline-block"
        >
          → Visiter Medico-Dict
        </a>
        <p className="mb-3 text-grey-700">
          Dictionnaire médical complet avec plus de 450 maladies répertoriées. 
          Offre des informations détaillées sur les symptômes, traitements, prévention et actions immédiates à prendre.
        </p>
        <div className="mb-3">
          <h4 className="font-semibold mb-2">✨ Fonctionnalités :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-grey-700 ml-2">
            <li><strong>Recherche avancée</strong> : Par nom de maladie, symptômes, ou partie du corps</li>
            <li><strong>Fiches détaillées</strong> : Description complète, symptômes, niveau de gravité, âge concerné</li>
            <li><strong>Actions immédiates</strong> : Guide étape par étape des actions à prendre en urgence</li>
            <li><strong>Informations de prévention</strong> : Conseils pour éviter les maladies</li>
            <li><strong>Traitements</strong> : Options de traitement disponibles</li>
            <li><strong>Classification</strong> : Par gravité (critique, modéré, léger), contagiosité, etc.</li>
          </ul>
        </div>
        <div>
          <p className="text-xs text-grey-600 italic border-l-4 border-orange-400 pl-3 py-2 bg-orange-50 rounded">
            ⚠️ <strong>Avertissement médical</strong> : Cette application est fournie à titre informatif uniquement et ne remplace pas une consultation médicale. 
            En cas de symptômes, consultez toujours un professionnel de santé qualifié.
          </p>
        </div>
      </div>

      {/* Project 4: DataAnalyzer */}
      <div className="mb-6 p-4 border border-grey-200 rounded-lg hover:shadow-lg transition-shadow">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-bold text-primary">Projet 4 : DataAnalyzer</h3>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">✓ Complété</span>
        </div>
        <p className="text-sm text-grey-600 mb-2 font-semibold">Analyseur de Données Complet - Machine Learning & Deep Learning</p>
        <p className="mb-3 text-grey-700">
          Outil d'analyse de données puissant et complet qui permet d'effectuer des analyses statistiques avancées, 
          du machine learning, et du deep learning sans avoir besoin d'écrire du code.
        </p>
        <div className="mb-3">
          <h4 className="font-semibold mb-2">🚀 Fonctionnalités :</h4>
          <ul className="list-disc list-inside space-y-1 text-sm text-grey-700 ml-2">
            <li><strong>Analyses de Base</strong> : Statistiques descriptives, corrélations, distributions, détection d'anomalies</li>
            <li><strong>Régression</strong> : Linéaire, polynomiale, Ridge, Lasso, ElasticNet, logistique</li>
            <li><strong>Classification</strong> : KNN, SVM, Random Forest, Decision Tree, Naive Bayes, XGBoost, LightGBM, AdaBoost</li>
            <li><strong>Réseaux de Neurones</strong> : MLP, Deep MLP, CNN, RNN, LSTM</li>
            <li><strong>Séries Temporelles</strong> : ARIMA, SARIMA, Prophet</li>
            <li><strong>Clustering</strong> : K-Means, DBSCAN, Hierarchical, GMM</li>
            <li><strong>Nettoyage de Données</strong> : Gestion des valeurs manquantes, détection des outliers, normalisation, encodage</li>
            <li><strong>Tests Statistiques</strong> : Shapiro-Wilk, T-test, ANOVA, Chi-carré, et plus</li>
            <li><strong>Génération de Rapports PDF</strong> : Rapports professionnels A4 avec métriques détaillées</li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-2">🔧 Technologies :</h4>
          <p className="text-sm text-grey-700 mb-2">
            <strong>Frontend :</strong> React 18, TypeScript, TailwindCSS, Vite<br />
            <strong>Backend :</strong> Flask, Pandas, NumPy, Scikit-learn, TensorFlow/Keras, Statsmodels, Prophet, XGBoost, LightGBM, ReportLab
          </p>
          <p className="text-xs text-grey-600 italic border-l-4 border-blue-400 pl-3 py-2 bg-blue-50 rounded">
            🎓 <strong>Note pour Data Scientists</strong> : Cet outil génère les résultats et métriques. L'interprétation et la compréhension des résultats restent la responsabilité de l'utilisateur.
          </p>
        </div>
      </div>
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mt-8 text-center">
        <p className="font-bold text-lg mb-2">💛 Soutenir Daloa Market</p>
        <p className="mb-2 text-sm">Aidez à faire évoluer ce projet local développé avec 0 budget !</p>
        <p className="mb-2">Envoyez un petit geste via Orange Money/Wave au <strong>+225 07 88 00 08 31</strong> ou MTN <strong>05 55 86 39 53</strong>.</p>
        <p className="text-sm">Merci pour votre soutien 🙏</p>
      </div>
    </div>
  </div>
);

export default AboutPage;
