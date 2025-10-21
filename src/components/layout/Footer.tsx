import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, MapPin, Phone } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-grey-900 text-grey-300">
      <div className="container-custom py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-2xl">🛍️</span>
              </div>
              <span className="text-2xl font-black text-white">DaloaMarket</span>
            </div>
            <p className="text-grey-400 leading-relaxed mb-6">
              La plateforme locale de confiance pour acheter et vendre des produits d'occasion à Daloa.
            </p>
            <div className="flex items-center gap-2 text-grey-400">
              <MapPin className="w-5 h-5" />
              <span>Daloa, Côte d'Ivoire</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Liens Rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/search" className="text-grey-400 hover:text-primary-400 transition-colors">
                  Rechercher
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="text-grey-400 hover:text-primary-400 transition-colors">
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-grey-400 hover:text-primary-400 transition-colors">
                  À propos
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-grey-400 hover:text-primary-400 transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/help" className="text-grey-400 hover:text-primary-400 transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-grey-400 hover:text-primary-400 transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-grey-400 hover:text-primary-400 transition-colors">
                  Confidentialité
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:support@daloamarket.com"
                  className="flex items-center gap-2 text-grey-400 hover:text-primary-400 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  support@daloamarket.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+2250788000831"
                  className="flex items-center gap-2 text-grey-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +225 07 88 00 08 31
                </a>
              </li>
              <li>
                <a
                  href="tel:+2250555863953"
                  className="flex items-center gap-2 text-grey-400 hover:text-primary-400 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +225 05 55 86 39 53
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-grey-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-grey-500 text-sm">
              © {new Date().getFullYear()} DaloaMarket. Tous droits réservés.
            </p>
            <div className="flex items-center gap-2 text-grey-500 text-sm">
              <span>Fait avec</span>
              <Heart className="w-4 h-4 text-error-500 fill-current" />
              <span>en Côte d'Ivoire</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
