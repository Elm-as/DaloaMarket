import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Mail, Phone, MapPin, Heart, ExternalLink } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-br from-grey-900 via-grey-800 to-grey-900 text-white mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Logo and Description */}
          <div className="col-span-1 lg:col-span-1">
            <Link to="/" className="flex items-center mb-6 group">
              <div className="h-12 w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-3 group-hover:scale-105 transition-transform shadow-lg">
                <ShoppingBag className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold">DaloaMarket</span>
            </Link>
            <p className="text-grey-300 leading-relaxed mb-6 text-sm lg:text-base">
              La première marketplace P2P de Daloa. Achetez et vendez facilement depuis chez vous.
            </p>
            <div className="flex items-center text-sm text-grey-400 bg-grey-800/50 rounded-xl px-4 py-3 border border-grey-700">
              <Heart className="h-4 w-4 mr-2 text-primary-400" />
              Fait à Daloa pour Daloa
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-primary-500 to-primary-600 rounded-full mr-3"></span>
              Liens rapides
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Accueil</span>
                </Link>
              </li>
              <li>
                <Link to="/search" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Rechercher</span>
                </Link>
              </li>
              <li>
                <Link to="/create-listing" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Vendre un article</span>
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Mon compte</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-secondary-500 to-secondary-600 rounded-full mr-3"></span>
              Catégories
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search?category=fashion" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Mode & Accessoires</span>
                </Link>
              </li>
              <li>
                <Link to="/search?category=electronics" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Électronique</span>
                </Link>
              </li>
              <li>
                <Link to="/search?category=home" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Maison & Jardin</span>
                </Link>
              </li>
              <li>
                <Link to="/search?category=vehicles" className="text-grey-300 hover:text-primary-400 transition-colors flex items-center group text-sm lg:text-base">
                  <span className="group-hover:translate-x-1 transition-transform">Auto & Moto</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-lg font-bold mb-6 text-white flex items-center">
              <span className="w-1 h-6 bg-gradient-to-b from-accent-500 to-accent-600 rounded-full mr-3"></span>
              Contact
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start group">
                <MapPin className="h-5 w-5 text-primary-400 mt-0.5 mr-3 flex-shrink-0" />
                <span className="text-grey-300 group-hover:text-white transition-colors text-sm lg:text-base">Daloa, Côte d'Ivoire</span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <div className="flex flex-col">
                  <a href="tel:+2250788000831" className="text-grey-300 hover:text-primary-400 transition-colors text-sm lg:text-base">
                    +225 07 88 00 08 31
                  </a>
                  <a href="tel:+2250555863953" className="text-grey-300 hover:text-primary-400 transition-colors text-xs lg:text-sm">
                    +225 05 55 86 39 53
                  </a>
                </div>
              </li>
              <li className="flex items-center group">
                <Mail className="h-5 w-5 text-primary-400 mr-3 flex-shrink-0" />
                <a href="mailto:support@daloamarket.shop" className="text-grey-300 hover:text-primary-400 transition-colors text-sm lg:text-base break-all">
                  support@daloamarket.shop
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Links */}
        <div className="border-t border-grey-700 mt-12 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            <div className="text-center lg:text-left">
              <p className="text-grey-400 text-sm mb-3">
                &copy; {new Date().getFullYear()} DaloaMarket. Tous droits réservés.
              </p>
              <div className="inline-flex items-start gap-2 bg-gradient-to-r from-warning-900/30 to-warning-800/30 border border-warning-600/30 rounded-xl p-4">
                <p className="text-xs text-warning-300 leading-relaxed text-left">
                  <strong>Version Bêta</strong> - Projet étudiant en développement. 
                  Aucune structure juridique formelle n'a encore été créée.
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center lg:justify-end gap-6">
              <Link to="/terms" className="text-grey-400 hover:text-primary-400 text-sm transition-colors flex items-center group">
                Conditions d'utilisation
                <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/privacy" className="text-grey-400 hover:text-primary-400 text-sm transition-colors flex items-center group">
                Confidentialité
                <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
              <Link to="/help" className="text-grey-400 hover:text-primary-400 text-sm transition-colors flex items-center group">
                Aide
                <ExternalLink className="h-3 w-3 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;