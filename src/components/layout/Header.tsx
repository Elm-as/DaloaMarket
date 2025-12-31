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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-grey-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 lg:py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group">
              <div className="h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mr-2.5 group-hover:scale-105 transition-transform shadow-md group-hover:shadow-lg">
                <ShoppingBag className="h-5 w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-grey-900 to-grey-700 bg-clip-text text-transparent">
                  DaloaMarket
                </span>
                <div className="scale-90 lg:scale-100">
                  <BetaBadge />
                </div>
              </div>
            </Link>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-xl">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Rechercher un produit..."
                className="w-full py-2.5 lg:py-3 pl-11 pr-4 rounded-xl border-2 border-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-grey-50 focus:bg-white transition-all text-sm lg:text-base placeholder-grey-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-1.5 lg:py-2 px-3 lg:px-4 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all font-medium text-xs lg:text-sm shadow-sm hover:shadow-md"
              >
                Rechercher
              </button>
            </form>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            <Link 
              to="/search" 
              className="p-2.5 rounded-xl text-grey-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
              title="Rechercher"
            >
              <Search className="h-5 w-5 lg:h-6 lg:w-6" />
            </Link>
            <Link 
              to="/about"
              className="px-3 py-2 rounded-xl text-grey-600 hover:text-primary-600 hover:bg-primary-50 transition-all font-medium text-sm"
            >
              À propos
            </Link>
            <Link
              to="/help"
              className="px-3 py-2 rounded-xl text-grey-600 hover:text-primary-600 hover:bg-primary-50 transition-all font-medium text-sm"
            >
              Aide
            </Link>
            <Link 
              to="/messages" 
              className="p-2.5 rounded-xl text-grey-600 hover:text-primary-600 hover:bg-primary-50 transition-all relative"
              title="Messages"
            >
              <MessageSquare className="h-5 w-5 lg:h-6 lg:w-6" />
            </Link>
            {user ? (
              <Link 
                to="/profile" 
                className="p-2.5 rounded-xl text-grey-600 hover:text-primary-600 hover:bg-primary-50 transition-all"
                title="Mon profil"
              >
                <User className="h-5 w-5 lg:h-6 lg:w-6" />
              </Link>
            ) : (
              <Link to="/login" className="btn-outline py-2 px-4 text-sm ml-2">
                Connexion
              </Link>
            )}
            <Link to="/create-listing" className="btn-primary py-2 px-4 text-sm ml-2 shadow-md hover:shadow-lg">
              Vendre
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2.5 rounded-xl bg-grey-50 text-grey-700 hover:bg-primary-50 hover:text-primary-600 transition-all" 
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Search */}
        <div className="mt-3 md:hidden">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Rechercher un produit..."
              className="w-full py-3 pl-11 pr-4 rounded-xl border-2 border-grey-200 focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 bg-grey-50 focus:bg-white transition-all text-sm shadow-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-grey-400" />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-primary-500 to-primary-600 text-white py-2 px-3 rounded-lg hover:from-primary-600 hover:to-primary-700 transition-all text-xs font-medium shadow-sm"
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