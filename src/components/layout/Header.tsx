import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, ShoppingBag, MessageSquare, } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import MobileMenu from './MobileMenu';
import BetaBadge from './BetaBadge';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useSupabase();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="sticky top-0 z-50 shadow-lg border-b border-grey-100 bg-white/90 md:bg-white/95 backdrop-blur-md">
      <div className="container-custom py-0 sm:py-3 lg:py-4">
        <div className="flex items-center justify-between md:justify-between">
          {/* Logo à gauche */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center group flex-shrink-0">
              <div className="h-8 w-8 sm:h-8 sm:w-8 lg:h-10 lg:w-10 bg-gradient-to-br from-primary to-primary-600 rounded-xl flex items-center justify-center mr-2 group-hover:scale-105 transition-transform shadow-md">
                <ShoppingBag className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <span className="text-lg lg:text-xl font-bold text-grey-900 leading-none">DaloaMarket</span>
              <div className="scale-75 sm:scale-100 origin-left ml-1">
                <BetaBadge />
              </div>
            </Link>
          </div>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:block flex-1 max-w-lg mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full py-2 lg:py-2.5 pl-9 lg:pl-10 pr-3 lg:pr-4 rounded-lg lg:rounded-xl border border-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-grey-50 focus:bg-white transition-all text-sm lg:text-base"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2.5 lg:left-3 top-2 lg:top-2.5 h-4 w-4 lg:h-5 lg:w-5 text-grey-400" />
              <button
                type="submit"
                className="absolute right-1 lg:right-1.5 top-0.5 lg:top-1 bg-primary text-white py-1.5 lg:py-2 px-2.5 lg:px-3 rounded-md lg:rounded-lg hover:bg-primary-600 transition-colors font-medium text-xs lg:text-sm"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link 
              to="/search" 
              className="p-2 lg:p-2.5 rounded-lg text-grey-700 hover:text-primary hover:bg-primary-50 transition-all touch-target"
              title="Rechercher"
            >
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </Link>
            <Link 
              to="/about"
              className="p-2 lg:p-2.5 rounded-lg text-grey-700 hover:text-primary hover:bg-primary-50 transition-all touch-target"
              title="À propos"
            >
              À propos
            </Link>
            <Link
              to="/help"
              className="p-2 lg:p-2.5 rounded-lg text-grey-700 hover:text-primary hover:bg-primary-50 transition-all touch-target"
              title="Aide & Support"
            >
              Aide
            </Link>
            <Link 
              to="/messages" 
              className="p-2 lg:p-2.5 rounded-lg text-grey-700 hover:text-primary hover:bg-primary-50 transition-all relative touch-target"
              title="Messages"
            >
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6" />
            </Link>
            {user ? (
              <Link 
                to="/profile" 
                className="p-2 lg:p-2.5 rounded-lg text-grey-700 hover:text-primary hover:bg-primary-50 transition-all touch-target"
                title="Mon profil"
              >
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
              </Link>
            ) : (
              <Link to="/login" className="btn-outline py-2 px-3 lg:py-2 lg:px-4 ml-2 text-xs lg:text-sm">
                Connexion
              </Link>
            )}
            <Link to="/create-listing" className="btn-primary py-2 lg:py-2.5 px-3 lg:px-4 ml-2 font-semibold text-xs lg:text-sm">
              Vendre
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-full bg-white/80 shadow-md text-grey-700 hover:bg-primary-50 transition-colors touch-target flex-shrink-0 ml-2" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Search (visible only on mobile) */}
        <div className="mt-2 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full py-2.5 pl-9 pr-3 rounded-lg border border-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white/80 focus:bg-white transition-all text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-grey-400" />
            <button
              type="submit"
              className="absolute right-1.5 top-1 bg-primary text-white py-1.5 px-3 rounded-md hover:bg-primary-600 transition-colors text-xs font-medium"
            >
              Rechercher
            </button>
          </form>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <MobileMenu onClose={toggleMenu} />}
    </header>
  );
};

export default Header;