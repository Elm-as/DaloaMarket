import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Home, 
  Search, 
  User, 
  MessageSquare, 
  PlusCircle,
  Settings,
  LogOut,
  CreditCard
} from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { BETA_FREE_MODE } from '../../lib/betaConfig';

interface MobileMenuProps {
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ onClose }) => {
  const { user, signOut, userProfile } = useSupabase();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    await signOut();
    onClose();
    navigate('/');
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col justify-end items-center">
      {/* Overlay animé, ne ferme que si on clique hors du menu */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity animate-fade-in"
        onClick={onClose}
      />
      {/* Drawer qui glisse du bas */}
      <div className="relative w-full max-w-md mx-auto bottom-0 z-50 bg-white rounded-3xl shadow-2xl border-t border-primary-100 animate-slide-up overflow-hidden">
        {/* Bouton X flottant en haut à droite */}
        <button 
          onClick={onClose} 
          className="absolute top-3 right-3 p-2 rounded-full bg-white/80 shadow hover:bg-grey-100 transition z-50"
          aria-label="Fermer le menu"
        >
          <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>

        {/* Navigation principale */}
        <div className="grid grid-cols-5 gap-1 px-2 py-3">
          <button
            onClick={() => handleNavigation('/')} 
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${isActive('/') ? 'bg-primary text-white shadow-xl scale-105' : 'text-grey-600 hover:bg-grey-100'}`}
          >
            <Home className="h-6 w-6 mb-1" />
            <span className="text-xs font-semibold">Accueil</span>
          </button>
          <button
            onClick={() => handleNavigation('/search')} 
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${isActive('/search') ? 'bg-primary text-white shadow-xl scale-105' : 'text-grey-600 hover:bg-grey-100'}`}
          >
            <Search className="h-6 w-6 mb-1" />
            <span className="text-xs font-semibold">Recherche</span>
          </button>
          <button
            onClick={() => handleNavigation('/create-listing')}
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all border-2 border-blue-200 shadow-xl scale-110 transform hover:scale-105 bg-gradient-to-br from-blue-500 to-blue-700 text-white ${isActive('/create-listing') ? 'ring-2 ring-blue-400' : ''}`}
            style={{zIndex:2}}
          >
            <PlusCircle className="h-7 w-7 mb-1" />
            <span className="text-xs font-bold">Vendre</span>
          </button>
          <button
            onClick={() => handleNavigation('/messages')} 
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all relative ${isActive('/messages') ? 'bg-primary text-white shadow-xl scale-105' : 'text-grey-600 hover:bg-grey-100'}`}
          >
            <MessageSquare className="h-6 w-6 mb-1" />
            <span className="text-xs font-semibold">Messages</span>
            {/* Badge notification */}
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-error-500 rounded-full border-2 border-white"></div>
          </button>
          <button
            onClick={() => handleNavigation('/profile')} 
            className={`flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all ${isActive('/profile') ? 'bg-primary text-white shadow-xl scale-105' : 'text-grey-600 hover:bg-grey-100'}`}
          >
            <User className="h-6 w-6 mb-1" />
            <span className="text-xs font-semibold">Profil</span>
          </button>
        </div>

        {/* Actions rapides et infos utilisateur */}
        {user && (
          <div className="border-t border-grey-100 px-5 py-4 bg-gradient-to-r from-primary-50 to-orange-50">
            <div className={`grid gap-2 ${BETA_FREE_MODE ? 'grid-cols-2' : 'grid-cols-3'}`}>
              {!BETA_FREE_MODE && (
                <button
                  onClick={() => handleNavigation('/acheter-credits')}
                  className="flex flex-col items-center py-2 px-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                >
                  <CreditCard className="h-4 w-4 text-blue-600 mb-1" />
                  <span className="text-xs font-medium text-blue-700">Crédits</span>
                </button>
              )}
              <button
                onClick={() => handleNavigation('/settings')}
                className="flex flex-col items-center py-2 px-3 bg-gradient-to-br from-grey-50 to-grey-100 rounded-lg border border-grey-200 hover:from-grey-100 hover:to-grey-200 transition-all"
              >
                <Settings className="h-4 w-4 text-grey-600 mb-1" />
                <span className="text-xs font-medium text-grey-700">Réglages</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex flex-col items-center py-2 px-3 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 hover:from-red-100 hover:to-red-200 transition-all"
              >
                <LogOut className="h-4 w-4 text-red-600 mb-1" />
                <span className="text-xs font-medium text-red-700">Sortir</span>
              </button>
            </div>
          </div>
        )}

        {/* Suppression du footer liens rapides et de l'espace inutile */}
      </div>
    </div>
  );
};

export default MobileMenu;