import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, TrendingUp, Users, Shield, Plus, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { Database } from '../lib/database.types';
import ListingCard from '../components/listings/ListingCard.clean';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { CATEGORIES } from '../lib/utils';
import { useSupabase } from '../hooks/useSupabase';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingWithSeller = Listing & { seller_name: string; seller_rating: number | null };

const HomePage: React.FC = () => {
  const [latestListings, setLatestListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const { userProfile, user } = useSupabase();

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

  const features = [
    {
      icon: Shield,
      title: 'Sécurisé',
      description: 'Paiements et transactions protégés',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Users,
      title: 'Communauté',
      description: 'Des milliers de vendeurs locaux',
      color: 'from-blue-400 to-primary-500'
    },
    {
      icon: TrendingUp,
      title: 'Tendances',
      description: 'Les meilleures offres du moment',
      color: 'from-purple-400 to-secondary-500'
    }
  ];

  return (
    <div className="min-h-screen bg-grey-50">
      {/* Hero Section - Modern iOS Style */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary-500 via-primary-600 to-secondary-600 pt-20 pb-24 lg:pt-32 lg:pb-32">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-lg px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-semibold">Marketplace #1 à Daloa</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight">
              Achetez et Vendez
              <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-white">
                En Toute Simplicité
              </span>
            </h1>

            <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
              La plateforme locale de confiance pour acheter et vendre des produits d'occasion à Daloa
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/search"
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Search className="w-5 h-5" />
                Explorer
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {user && (
                <Link
                  to="/create-listing"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  <Plus className="w-5 h-5" />
                  Vendre
                </Link>
              )}
            </div>
          </motion.div>
        </div>

        {/* Decorative bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="#F2F2F7"/>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-20 bg-grey-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-grey-100"
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-grey-900 mb-3">{feature.title}</h3>
                <p className="text-grey-600 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-grey-900 mb-4">
              Parcourir par Catégorie
            </h2>
            <p className="text-lg text-grey-600 max-w-2xl mx-auto">
              Trouvez exactement ce que vous cherchez
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {CATEGORIES.map((category) => (
              <Link
                key={category}
                to={`/search?category=${encodeURIComponent(category)}`}
                className="group relative bg-grey-50 hover:bg-gradient-to-br hover:from-primary-50 hover:to-secondary-50 rounded-2xl p-6 text-center transition-all duration-300 border-2 border-transparent hover:border-primary-200"
              >
                <div className="text-4xl mb-3 group-hover:scale-110 transition-transform duration-300">
                  {category === 'Électronique' && '📱'}
                  {category === 'Mode' && '👕'}
                  {category === 'Maison' && '🏠'}
                  {category === 'Sport' && '⚽'}
                  {category === 'Véhicules' && '🚗'}
                  {category === 'Livres' && '📚'}
                  {category === 'Jouets' && '🧸'}
                  {category === 'Autre' && '✨'}
                </div>
                <span className="font-bold text-grey-900 group-hover:text-primary-600 transition-colors">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Listings */}
      <section className="py-16 lg:py-20 bg-grey-50">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl lg:text-4xl font-black text-grey-900 mb-2">
                Dernières Annonces
              </h2>
              <p className="text-lg text-grey-600">
                Les articles les plus récents
              </p>
            </div>
            <Link
              to="/search"
              className="hidden sm:inline-flex items-center gap-2 text-primary-600 font-bold hover:gap-3 transition-all duration-300"
            >
              Tout voir
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <LoadingSpinner size="large" />
            </div>
          ) : latestListings.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {latestListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
              <div className="text-center mt-12 sm:hidden">
                <Link
                  to="/search"
                  className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors"
                >
                  Voir toutes les annonces
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl">
              <div className="text-6xl mb-4">📦</div>
              <p className="text-grey-600 text-lg">Aucune annonce disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-20 lg:py-32 bg-gradient-to-br from-primary-600 to-secondary-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnptMCAxMmMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA1KSIgc3Ryb2tlLXdpZHRoPSIyIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>

          <div className="container-custom relative z-10">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Prêt à commencer ?
              </h2>
              <p className="text-xl text-white/90 mb-10 leading-relaxed">
                Rejoignez des milliers d'utilisateurs qui font confiance à DaloaMarket
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 bg-white text-primary-600 px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  Créer un compte
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 bg-white/10 backdrop-blur-lg text-white border-2 border-white/30 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all duration-300"
                >
                  Se connecter
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
