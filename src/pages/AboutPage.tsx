import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';


const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-grey-25 via-grey-50 to-grey-100 py-16">
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
      <motion.div
        className="bg-white rounded-3xl shadow-xl p-8 sm:p-12 border-2 border-grey-100"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-6">
            À propos
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Daloa Market
          </h1>
        </motion.div>

        {/* Main Description */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-lg text-grey-700 leading-relaxed mb-4">
            <strong className="text-primary-600">Daloa Market</strong> est une plateforme locale permettant aux habitants de Daloa, notamment les étudiants, de vendre et d'acheter facilement des objets d'occasion entre eux.
          </p>
          <p className="text-lg text-grey-700 leading-relaxed mb-4">
            Le projet est actuellement en <span className="text-primary-600 font-semibold">phase de test (bêta)</span> à l'université de Daloa, avant un lancement officiel plus large.
          </p>
          <p className="text-lg text-grey-700 leading-relaxed">
            La plateforme est <span className="font-semibold text-grey-900">entièrement gratuite</span> pour publier vos annonces et connecter avec des acheteurs locaux.
          </p>
        </motion.div>

        {/* Beta Warning Box */}
        <motion.div
          className="mb-10 p-6 bg-gradient-to-br from-warning-50 to-warning-100 border-2 border-warning-400 rounded-2xl"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div>
            <p className="text-warning-900 font-semibold mb-2">Phase de test</p>
            <p className="text-warning-800 text-sm leading-relaxed">
              La plateforme évolue rapidement grâce à vos retours. Certaines fonctionnalités ou conditions peuvent changer sans préavis.
            </p>
            <p className="text-warning-800 text-sm mt-2">
              <strong>Aucune structure juridique formelle n'est encore créée.</strong> L'activité reste à petite échelle et s'adapte selon les retours des utilisateurs.
            </p>
          </div>
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="mb-10 p-6 bg-grey-50 rounded-2xl border border-grey-200"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-sm text-grey-600 leading-relaxed">
            Pour toute question sur la confidentialité, les conditions ou le fonctionnement, consultez aussi les pages{' '}
            <a href="/faq" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">FAQ</a>,{' '}
            <a href="/help" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Aide</a>,{' '}
            <a href="/terms" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Conditions</a> et{' '}
            <a href="/privacy" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">Confidentialité</a>.
          </p>
          <p className="text-sm text-grey-600 mt-3">
            <span className="font-semibold text-grey-900">Contact officiel :</span>{' '}
            <a href="mailto:support@daloamarket.shop" className="text-primary-600 font-semibold hover:text-primary-700 transition-colors">
              support@daloamarket.shop
            </a>
          </p>
        </motion.div>

        {/* WhatsApp Contact Button */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <a
            href="https://wa.me/2250788000831"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-2xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.21 5.077 4.377.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.591.418 3.086 1.144 4.375L3 21l4.755-1.244A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
            </svg>
            Contacter le support WhatsApp
          </a>
        </motion.div>

        {/* Creator Section */}
        <motion.div
          className="border-t-2 border-grey-200 pt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-grey-900">À propos du créateur</h2>
          </div>
          
          <div className="bg-gradient-to-br from-primary-50 to-secondary-50 p-6 rounded-2xl border-2 border-primary-200 mb-6">
            <p className="text-grey-700 leading-relaxed mb-4">
              Je m'appelle <strong className="text-grey-900">Elmas Oulobo</strong>, étudiant en M1 Data Science, passionné de programmation et de développement web.
            </p>
            <p className="text-grey-700 leading-relaxed">
              Ce projet est développé sans budget, uniquement avec ma connexion et ma détermination, pour aider la communauté locale.
            </p>
          </div>
          
          <p className="text-lg text-center text-grey-700 font-medium">
            Merci à tous ceux qui soutiennent cette initiative locale
          </p>
        </motion.div>

        {/* Support Box */}
        <motion.div
          className="mt-12 bg-gradient-to-br from-accent-50 to-accent-100 border-2 border-accent-400 rounded-2xl p-8 text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="font-bold text-2xl mb-3 text-grey-900">Soutenir Daloa Market</p>
          <p className="mb-4 text-grey-700">Aidez à faire évoluer ce projet local développé avec 0 budget !</p>
          <p className="mb-2 text-grey-800">
            Envoyez un petit geste via <strong>Orange Money/Wave</strong> au <strong className="text-primary-600">+225 07 88 00 08 31</strong>
          </p>
          <p className="text-grey-800">
            ou <strong>MTN</strong> au <strong className="text-primary-600">05 55 86 39 53</strong>
          </p>
          <p className="text-sm text-grey-600 mt-4">Merci pour votre soutien</p>
        </motion.div>
      </motion.div>
    </div>
  </div>
);

export default AboutPage;
