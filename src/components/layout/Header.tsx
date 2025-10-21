import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, Search, User, Plus, MessageSquare, Home, X } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { motion, AnimatePresence } from 'framer-motion';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { user, signOut } = useSupabase();
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-grey-200/50 shadow-sm">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30 group-hover:scale-105 transition-transform">
                <span className="text-2xl">🛍️</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl lg:text-2xl font-black text-grey-900 tracking-tight">
                  DaloaMarket
                </span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <form onSubmit={handleSearch} className="hidden lg:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
                <input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-12 pl-12 pr-4 rounded-2xl bg-grey-100 border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none text-grey-900 placeholder-grey-500 font-medium"
                />
              </div>
            </form>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    to="/create-listing"
                    className="inline-flex items-center gap-2 bg-primary-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                  >
                    <Plus className="w-5 h-5" />
                    Vendre
                  </Link>
                  <Link
                    to="/messages"
                    className="p-3 rounded-xl text-grey-700 hover:bg-grey-100 transition-colors"
                    title="Messages"
                  >
                    <MessageSquare className="w-6 h-6" />
                  </Link>
                  <Link
                    to="/profile"
                    className="p-3 rounded-xl text-grey-700 hover:bg-grey-100 transition-colors"
                    title="Profil"
                  >
                    <User className="w-6 h-6" />
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="px-5 py-2.5 rounded-xl text-grey-700 font-bold hover:bg-grey-100 transition-colors"
                  >
                    Connexion
                  </Link>
                  <Link
                    to="/register"
                    className="px-5 py-2.5 rounded-xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-500/30"
                  >
                    Inscription
                  </Link>
                </>
              )}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-grey-700 hover:bg-grey-100 transition-colors"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Search Bar */}
          <form onSubmit={handleSearch} className="lg:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-grey-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-grey-100 border-2 border-transparent focus:border-primary-500 focus:bg-white transition-all outline-none text-grey-900 placeholder-grey-500"
              />
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 bottom-0 w-80 bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <nav className="p-6 space-y-2">
                {user ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      <User className="w-5 h-5" />
                      Mon Profil
                    </Link>
                    <Link
                      to="/create-listing"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Créer une annonce
                    </Link>
                    <Link
                      to="/messages"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      <MessageSquare className="w-5 h-5" />
                      Messages
                    </Link>
                    <div className="border-t border-grey-200 my-4" />
                    <Link
                      to="/search"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      <Search className="w-5 h-5" />
                      Rechercher
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      À propos
                    </Link>
                    <Link
                      to="/help"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      Aide
                    </Link>
                    <div className="border-t border-grey-200 my-4" />
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 p-4 rounded-2xl hover:bg-error-50 transition-colors font-semibold text-error-600"
                    >
                      Déconnexion
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      <Home className="w-5 h-5" />
                      Accueil
                    </Link>
                    <Link
                      to="/search"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      <Search className="w-5 h-5" />
                      Rechercher
                    </Link>
                    <Link
                      to="/about"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      À propos
                    </Link>
                    <Link
                      to="/help"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-3 p-4 rounded-2xl hover:bg-grey-50 transition-colors font-semibold text-grey-900"
                    >
                      Aide
                    </Link>
                    <div className="border-t border-grey-200 my-4" />
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl border-2 border-grey-200 hover:border-grey-300 transition-colors font-bold text-grey-900"
                    >
                      Connexion
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-primary-600 text-white font-bold hover:bg-primary-700 transition-colors"
                    >
                      Inscription
                    </Link>
                  </>
                )}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
