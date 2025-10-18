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
