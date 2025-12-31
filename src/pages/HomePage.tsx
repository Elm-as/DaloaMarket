import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowRight, AlertCircle, TrendingUp, Users, Shield } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../lib/database.types';
import ListingCard from '../components/listings/ListingCard.clean';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CATEGORIES } from '../lib/utils';
import { useSupabase } from '../hooks/useSupabase';
import { toast } from 'react-hot-toast';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingWithSeller = Listing & { seller_name: string; seller_rating: number | null };

const HomePage: React.FC = () => {
  const [latestListings, setLatestListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, user } = useSupabase();
  const [userCredits, setUserCredits] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestListings = async () => {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('listings')
          .select(`
            *,
            users:user_id (
              full_name,
              rating
            )
          `)
          .eq('status', 'active')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        const formattedListings = data.map(item => ({
          ...item,
          seller_name: item.users?.full_name || 'Utilisateur',
          seller_rating: item.users?.rating || null
        }));

        setLatestListings(formattedListings);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestListings();
  }, []);

  useEffect(() => {
    const fetchCredits = async () => {
      if (!user?.id || !isSupabaseConfigured) {
        setUserCredits(null);
        return;
      }
      // @ts-expect-error accès table custom
      const { data, error } = await (supabase as unknown)
        .from('user_credits')
        .select('credits')
        .eq('user_id', user.id)
        .single();
      if (error) {
        setUserCredits(null);
      } else {
        setUserCredits(data?.credits ?? 0);
      }
    };
    fetchCredits();
  }, [user]);

  useEffect(() => {
    if (localStorage.getItem('credit_purchase_pending')) {
      toast.success('Crédits ajoutés à votre compte !');
      localStorage.removeItem('credit_purchase_pending');
    }
  }, []);

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-grey-50 to-grey-100">
        <section className="section-padding">
          <div className="responsive-container">
            <div className="bg-white rounded-xl lg:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 border border-warning-200">
              <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-warning-600 mx-auto mb-3 sm:mb-4 lg:mb-6" />
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-warning-800 mb-2 sm:mb-3 lg:mb-4">Configuration Required</h2>
              <p className="text-warning-700 mb-4 sm:mb-6 lg:mb-8 text-sm sm:text-base lg:text-lg">
                To use DaloaMarket, you need to configure your Supabase database connection.
              </p>
              <div className="bg-grey-50 rounded-lg lg:rounded-xl p-3 sm:p-4 lg:p-6 text-left">
                <h3 className="font-semibold mb-2 sm:mb-3 lg:mb-4 text-sm sm:text-base lg:text-lg">Setup Instructions:</h3>
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 lg:space-y-3 text-xs sm:text-sm lg:text-base">
                  <li>Go to <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-primary underline font-medium">supabase.com</a> and create a new project</li>
                  <li>In your Supabase dashboard, go to Settings → API</li>
                  <li>Copy your Project URL and anon/public key</li>
                  <li>Update the .env file with your actual credentials</li>
                  <li>Restart your development server</li>
                </ol>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-25 via-grey-50 to-grey-100">
      {/* Hero Section */}
      <motion.section
        className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-700 py-12 sm:py-16 lg:py-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {/* Animated background patterns */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-black/10 to-transparent"></div>
          <div className="absolute top-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute bottom-20 left-20 w-40 h-40 bg-accent-500/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="mb-6"
            >
              <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-6">
                🎉 Plateforme 100% locale
              </span>
            </motion.div>
            
            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white mb-6 leading-tight"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              Achetez et vendez{' '}
              <span className="relative inline-block">
                <span className="relative z-10 bg-gradient-to-r from-accent-300 to-accent-500 bg-clip-text text-transparent">
                  facilement
                </span>
                <span className="absolute bottom-2 left-0 w-full h-3 bg-accent-400/30 -rotate-1"></span>
              </span>
              <br />
              à Daloa
            </motion.h1>
            
            <motion.p
              className="text-white/90 text-lg sm:text-xl lg:text-2xl mb-8 sm:mb-10 leading-relaxed max-w-3xl mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              La première marketplace P2P de Daloa. Publiez vos annonces simplement et connectez-vous avec des acheteurs locaux.
            </motion.p>
            
            {userProfile && (!userProfile.full_name || !userProfile.phone || !userProfile.district) && (
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="mb-8 p-4 bg-warning-50 border-2 border-warning-400 rounded-xl max-w-md mx-auto backdrop-blur-sm"
              >
                <p className="text-warning-800 font-semibold mb-3 text-lg">⚠️ Profil incomplet</p>
                <Link to="/complete-profile" className="btn-primary bg-warning-600 hover:bg-warning-700">
                  Compléter mon profil
                </Link>
              </motion.div>
            )}
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto"
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link to="/search" className="btn-outline bg-white text-primary-600 hover:bg-grey-50 border-white w-full sm:w-auto min-w-[160px] shadow-lg hover:shadow-xl">
                Parcourir
              </Link>
              <Link to="/create-listing" className="btn-primary bg-gradient-to-r from-accent-500 to-accent-600 border-0 w-full sm:w-auto min-w-[160px] shadow-lg hover:shadow-xl">
                Publier une annonce
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Modern decorative elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border-4 border-white/20 rounded-full animate-bounce-gentle"></div>
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-white/10 rounded-lg rotate-12 animate-bounce-gentle" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-1/2 left-5 w-12 h-12 border-4 border-accent-300/30 rounded-full animate-pulse-slow"></div>
      </motion.section>

      {/* Stats Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <motion.div
              className="relative group bg-gradient-to-br from-primary-50 to-primary-100 rounded-2xl p-8 text-center 
                         border-2 border-primary-200 hover:border-primary-400 transition-all duration-300 
                         hover:shadow-xl hover:-translate-y-1"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-primary-200/50 rounded-full blur-xl group-hover:bg-primary-300/50 transition-colors"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-grey-900 mb-2">500+</h3>
                <p className="text-grey-600 font-medium">Annonces publiées</p>
              </div>
            </motion.div>
            
            <motion.div
              className="relative group bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-8 text-center 
                         border-2 border-secondary-200 hover:border-secondary-400 transition-all duration-300 
                         hover:shadow-xl hover:-translate-y-1"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-secondary-200/50 rounded-full blur-xl group-hover:bg-secondary-300/50 transition-colors"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-grey-900 mb-2">200+</h3>
                <p className="text-grey-600 font-medium">Utilisateurs actifs</p>
              </div>
            </motion.div>
            
            <motion.div
              className="relative group bg-gradient-to-br from-success-50 to-success-100 rounded-2xl p-8 text-center 
                         border-2 border-success-200 hover:border-success-400 transition-all duration-300 
                         hover:shadow-xl hover:-translate-y-1"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-success-200/50 rounded-full blur-xl group-hover:bg-success-300/50 transition-colors"></div>
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-success-500 to-success-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-4xl lg:text-5xl font-bold text-grey-900 mb-2">100%</h3>
                <p className="text-grey-600 font-medium">Sécurisé</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-grey-25 to-grey-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.span
              className="inline-block px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-semibold mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4 }}
              viewport={{ once: true }}
            >
              Catégories
            </motion.span>
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-grey-900 mb-4"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Explorez par catégorie
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-grey-600 max-w-2xl mx-auto"
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              Trouvez exactement ce que vous cherchez
            </motion.p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6 max-w-7xl mx-auto">
            {CATEGORIES.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ scale: 0.9, opacity: 0, y: 20 }}
                whileInView={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                viewport={{ once: true }}
              >
                <Link
                  to={`/search?category=${category.id}`}
                  className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 p-6 text-center border-2 border-grey-100 hover:border-primary-300 transform hover:-translate-y-2 flex flex-col items-center justify-center min-h-[160px]"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary-50/0 to-primary-100/0 group-hover:from-primary-50/50 group-hover:to-primary-100/30 rounded-2xl transition-all duration-300"></div>
                  <div className="relative">
                    <div className="h-16 w-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md">
                      <ShoppingBag className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="font-bold text-grey-900 text-sm sm:text-base leading-tight group-hover:text-primary-600 transition-colors">
                      {category.label}
                    </h3>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 sm:mb-12 gap-4">
            <div>
              <motion.h2
                className="text-3xl sm:text-4xl lg:text-5xl font-bold text-grey-900 mb-2"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                Dernières annonces
              </motion.h2>
              <motion.p
                className="text-lg sm:text-xl text-grey-600"
                initial={{ x: -20, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                Découvrez les nouveautés
              </motion.p>
            </div>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Link to="/search" className="group inline-flex items-center text-primary-600 font-semibold hover:text-primary-700 transition-colors text-base sm:text-lg">
                Voir tout 
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
          
          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : latestListings.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {latestListings.map((listing, index) => (
                <motion.div
                  key={listing.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <ListingCard 
                    listing={listing} 
                    sellerName={listing.seller_name}
                    sellerRating={listing.seller_rating}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <motion.div
              className="bg-gradient-to-br from-grey-50 to-white rounded-3xl shadow-lg p-8 sm:p-12 text-center max-w-2xl mx-auto border-2 border-grey-100"
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-grey-900">Aucune annonce pour le moment</h3>
              <p className="text-grey-600 mb-8 text-base sm:text-lg leading-relaxed">
                Soyez le premier à publier une annonce et connectez-vous avec des acheteurs locaux !
              </p>
              <Link to="/create-listing" className="btn-primary">
                Publier une annonce
              </Link>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works Link */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-secondary-50 to-secondary-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-16 h-16 bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-grey-900 mb-4">Nouveau sur DaloaMarket ?</h2>
            <p className="text-lg sm:text-xl text-grey-600 mb-8">
              Découvrez comment fonctionne notre plateforme en quelques minutes.
            </p>
            <Link to="/how-it-works" className="btn-primary bg-gradient-to-r from-secondary-600 to-secondary-700 border-0">
              Comment ça marche
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-500 to-secondary-600 py-16 sm:py-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent-500/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            className="max-w-4xl mx-auto"
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Prêt à vendre vos articles ?
            </h2>
            <p className="text-white/90 mb-10 text-lg sm:text-xl leading-relaxed max-w-2xl mx-auto">
              Rejoignez des centaines d'utilisateurs qui vendent déjà sur DaloaMarket. C'est simple, rapide et local !
            </p>
            <Link to="/create-listing" className="btn-outline bg-white text-primary-600 hover:bg-grey-50 border-white shadow-xl hover:shadow-2xl">
              Publier ma première annonce
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Credits Display */}
      {user && (
        <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
          <motion.div
            className="bg-white rounded-2xl shadow-2xl px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3 border-2 border-primary-200 backdrop-blur-sm"
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full animate-pulse"></div>
            <span className="font-semibold text-grey-700 text-sm sm:text-base">Crédits:</span>
            <span className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-500 bg-clip-text text-transparent">
              {userCredits !== null ? userCredits : <LoadingSpinner size="small" />}
            </span>
            <Link to="/acheter-credits" className="btn-primary py-2 px-4 text-sm shadow-md hover:shadow-lg">
              Acheter
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomePage;