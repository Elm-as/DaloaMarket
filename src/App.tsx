import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useSupabase } from './hooks/useSupabase';
import Layout from './components/layout/Layout';
import PrivateRoute from './components/auth/PrivateRoute';

// Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import UpdatePasswordPage from './pages/auth/UpdatePasswordPage';
import CompleteProfilePage from './pages/auth/CompleteProfilePage';
import ProfilePage from './pages/profile/ProfilePage';
import SellerProfilePage from './pages/profile/SellerProfilePage';
import ListingCreatePage from './pages/listings/ListingCreatePage';
import ListingDetailPage from './pages/listings/ListingDetailPage';
import SearchPage from './pages/search/SearchPage';
import MessagesPage from './pages/messages/MessagesPage';
import ChatPage from './pages/messages/ChatPage';
import PaymentSuccessPage from './pages/payment/PaymentSuccessPage';
import PaymentFailurePage from './pages/payment/PaymentFailurePage';
import ListingPaymentPage from './pages/payment/ListingPaymentPage';
import NotFoundPage from './pages/NotFoundPage';
import BannedPage from './pages/auth/BannedPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import FAQPage from './pages/FAQPage';
import TermsPage from './pages/TermsPage';
import PrivacyPage from './pages/PrivacyPage';
import SettingsPage from './pages/profile/SettingsPage';
import HelpPage from './pages/HelpPage';
import EmailConfirmedPage from './pages/auth/EmailConfirmedPage';
import AchatCreditsPage from './pages/AchatCreditsPage';
import HowItWorksPage from './pages/HowItWorksPage';

function App() {
  const location = useLocation();
  const { user, userProfile } = useSupabase();

  // Redirection automatique si l'utilisateur est banni
  if (userProfile && userProfile.banned) {
    return <Navigate to="/banned" replace />;
  }

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
      {/* Admin Dashboard - accès réservé aux admins */}
      <Route path="/admin" element={<AdminDashboardPage />} />
      <Route path="/" element={<Layout><HomePage /></Layout>} />
      
      {/* Auth Routes */}
      <Route path="/login" element={
        user ? <Navigate to="/" replace /> : <Layout><LoginPage /></Layout>
      } />
      <Route path="/register" element={
        user ? <Navigate to="/" replace /> : <Layout><RegisterPage /></Layout>
      } />
      <Route path="/auth/reset-password" element={<Layout><ResetPasswordPage /></Layout>} />
      <Route path="/auth/update-password" element={<Layout><UpdatePasswordPage /></Layout>} />
      <Route path="/complete-profile" element={
        <Layout>
          <PrivateRoute>
            {/* On autorise l'accès à la page tant que le profil n'est pas complet (nom, téléphone, quartier) */}
            {userProfile && userProfile.full_name && userProfile.phone && userProfile.district
              ? <Navigate to="/" replace />
              : <CompleteProfilePage />}
          </PrivateRoute>
        </Layout>
      } />
      <Route path="/email-confirmed" element={<Layout><EmailConfirmedPage /></Layout>} />
      
      {/* Listing Routes */}
      <Route path="/create-listing" element={
        <Layout>
          <PrivateRoute requireProfile>
            <ListingCreatePage />
          </PrivateRoute>
        </Layout>
      } />
      <Route path="/listings/:id" element={<Layout><ListingDetailPage /></Layout>} />
      
      {/* Search */}
      <Route path="/search" element={<Layout><SearchPage /></Layout>} />
      

      {/* Messages */}
      <Route path="/messages" element={
        <Layout>
          <PrivateRoute requireProfile>
            <MessagesPage />
          </PrivateRoute>
        </Layout>
      } />

      {/* Achat crédits - accessible uniquement connecté */}
      <Route path="/acheter-credits" element={
        <Layout>
          <PrivateRoute>
            <AchatCreditsPage />
          </PrivateRoute>
        </Layout>
      } />
      <Route path="/messages/:listingId/:userId" element={
        <Layout>
          <PrivateRoute requireProfile>
            <ChatPage />
          </PrivateRoute>
        </Layout>
      } />
      
      {/* Profile */}
      <Route path="/profile" element={
        <Layout>
          <PrivateRoute requireProfile>
            <ProfilePage />
          </PrivateRoute>
        </Layout>
      } />
      <Route path="/profile/seller/:sellerId" element={<Layout><SellerProfilePage /></Layout>} />
      <Route path="/settings" element={
        <Layout>
          <PrivateRoute requireProfile>
            <SettingsPage />
          </PrivateRoute>
        </Layout>
      } />
      
      {/* Payment */}
      <Route path="/paiement-annonce/:id" element={<Layout><ListingPaymentPage /></Layout>} />
      <Route path="/payment/success" element={<Layout><PaymentSuccessPage /></Layout>} />
      <Route path="/payment/failure" element={<Layout><PaymentFailurePage /></Layout>} />
      
      {/* Info Pages */}
      <Route path="/about" element={<Layout><AboutPage /></Layout>} />
      <Route path="/faq" element={<Layout><FAQPage /></Layout>} />
      <Route path="/terms" element={<Layout><TermsPage /></Layout>} />
      <Route path="/privacy" element={<Layout><PrivacyPage /></Layout>} />
      <Route path="/help" element={<Layout><HelpPage /></Layout>} />
      <Route path="/how-it-works" element={<Layout><HowItWorksPage /></Layout>} />
      
      {/* Achat Credits */}
      <Route path="/acheter-credits" element={
        <Layout>
          <PrivateRoute requireProfile>
            <AchatCreditsPage />
          </PrivateRoute>
        </Layout>
      } />
      

      {/* Page utilisateur banni */}
      <Route path="/banned" element={<BannedPage />} />

      {/* 404 */}
      <Route path="*" element={<Layout><NotFoundPage /></Layout>} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;