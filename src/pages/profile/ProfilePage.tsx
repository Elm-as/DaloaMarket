import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Phone, 
  MapPin, 
  Star, 
  Settings, 
  LogOut,
  ShoppingBag,
  AlertCircle,
  Heart
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupabase } from '../../hooks/useSupabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ListingCard from '../../components/listings/ListingCard';
import { formatPhoneNumber, formatDate } from '../../lib/utils';
import { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];
type Review = Database['public']['Tables']['reviews']['Row'] & {
  reviewer: { full_name: string };
  listing: { title: string };
};

const ProfilePage: React.FC = () => {
  const { user, userProfile, signOut } = useSupabase();
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews' | 'favorites'>('listings');
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [userFavorites, setUserFavorites] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [userCredits, setUserCredits] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  
  useEffect(() => {
    if (!user) return;
    const fetchUserData = async () => {
      try {
        // Fetch user listings
        const { data: listings, error: listingsError } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (listingsError) throw listingsError;
        setUserListings(listings || []);

        // Fetch user reviews
        const { data: reviews, error: reviewsError } = await supabase
          .from('reviews')
          .select(`
            *,
            reviewer:users!reviews_reviewer_id_fkey (
              full_name
            ),
            listing:listings!reviews_listing_id_fkey (
              title
            )
          `)
          .eq('reviewed_id', user.id)
          .order('created_at', { ascending: false });
        if (reviewsError) throw reviewsError;
        setUserReviews(reviews || []);

        // Fetch user favorites (jointure sur listings)
        const { data: favorites, error: favError } = await supabase
          .from('favorites')
          .select('listing:listings(*)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (favError) throw favError;
        setUserFavorites((favorites || []).map(f => f.listing).filter(Boolean));
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [user]);
  
  // Récupérer le solde de crédits à l'ouverture
  useEffect(() => {
    if (!user) return;
    const fetchCredits = async () => {
      // @ts-expect-error: accès table custom
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
  
  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Déconnexion réussie');
    } catch (error) {
      console.error('Sign out error:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  }
  
  // Fonction de suppression d'annonce
  async function handleDeleteListing(listingId: string) {
    setDeletingId(listingId);
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listingId);
      if (error) throw error;
      toast.success('Annonce supprimée');
      setUserListings((prev) => prev.filter(l => l.id !== listingId));
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  }
  
  if (loading) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!userProfile) {
    return (
      <div className="min-h-screen bg-grey-50 py-8">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-card shadow-card p-8 text-center">
            <AlertCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Profil incomplet</h1>
            <p className="text-grey-600 mb-6">
              Vous devez compléter votre profil pour accéder à cette page.
            </p>
            <Link to="/complete-profile" className="btn-primary">
              Compléter mon profil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-grey-50 py-4 sm:py-6 lg:py-8">
      <div className="container-custom max-w-6xl">
        {/* Affichage du solde de crédits si connecté */}
        {user && (
          <div className="flex justify-end">
            <div className="bg-white rounded-lg lg:rounded-xl shadow-md px-3 sm:px-4 py-2 flex items-center gap-1.5 sm:gap-2 text-primary font-semibold">
              <span className="text-sm sm:text-base">Crédits:</span>
              <span className="text-base sm:text-lg">{userCredits !== null ? userCredits : <LoadingSpinner size="small" />}</span>
              <Link to="/acheter-credits" className="ml-2 btn-secondary py-1 px-2 text-xs sm:text-sm">Acheter</Link>
            </div>
          </div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg p-4 sm:p-6">
              <div className="flex flex-col items-center text-center mb-4 sm:mb-6">
                <div className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24 rounded-full bg-primary-100 flex items-center justify-center mb-3 sm:mb-4">
                  <User className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-primary" />
                </div>
                
                <h1 className="text-lg sm:text-xl lg:text-2xl font-bold">{userProfile.full_name}</h1>
                
                <p className="text-grey-600 mt-1 text-sm sm:text-base">{user?.email}</p>
                
                <Link to="/settings" className="btn-secondary mt-2 sm:mt-3 mb-2 w-full max-w-xs text-sm sm:text-base">
                  Modifier mon profil
                </Link>
                
                {userProfile.rating && (
                  <div className="flex items-center mt-2">
                    <Star className="h-4 w-4 sm:h-5 sm:w-5 text-primary fill-current" />
                    <span className="ml-1 font-medium text-sm sm:text-base">{userProfile.rating.toFixed(1)}</span>
                    <span className="text-grey-500 ml-1 text-sm">({userReviews.length} avis)</span>
                  </div>
                )}
                
                <p className="text-xs sm:text-sm text-grey-500 mt-2">
                  Membre depuis {formatDate(userProfile.created_at)}
                </p>
              </div>
              
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 sm:h-5 sm:w-5 text-grey-500" />
                  <span className="text-sm sm:text-base">{formatPhoneNumber(userProfile.phone)}</span>
                  {userProfile.phone && (
                    <a
                      href={`https://wa.me/${(() => {
                        // Nettoyage du numéro
                        const phone = userProfile.phone.replace(/[^\d]/g, '');
                        // Si commence par 225 (déjà indicatif), on garde
                        if (phone.startsWith('225')) return phone;
                        // Si commence par 0 et fait 10 chiffres (numéro ivoirien sans indicatif)
                        if (phone.length === 10 && phone.startsWith('0')) return '225' + phone;
                        // Si fait 8 chiffres (ancien format), on ajoute 2250 devant
                        if (phone.length === 8) return '2250' + phone;
                        // Si déjà un indicatif international (ex: 33, 226, etc), on garde
                        if (phone.length > 10 && !phone.startsWith('225')) return phone;
                        // Sinon, on tente de renvoyer tel quel
                        return phone;
                      })()}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-2 px-2 py-1 bg-green-500 hover:bg-green-600 text-white rounded flex items-center gap-1 text-xs sm:text-sm transition"
                      title="Contacter sur WhatsApp"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.21 5.077 4.377.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.591.418 3.086 1.144 4.375L3 21l4.755-1.244A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
                      </svg>
                      WhatsApp
                    </a>
                  )}
                </div>
                
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-grey-500 mr-3" />
                  <span className="text-sm sm:text-base">{userProfile.district}</span>
                </div>
              </div>
              
              <div className="flex flex-col space-y-2 sm:space-y-3">
                <Link to="/settings" className="btn-outline flex items-center justify-center text-sm sm:text-base">
                  <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Paramètres
                </Link>
                
                <button
                  onClick={handleSignOut}
                  className="btn-outline text-error-600 border-error-600 hover:bg-error-50 flex items-center justify-center text-sm sm:text-base"
                >
                  <LogOut className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Déconnexion
                </button>
              </div>
            </div>
          </div>
          
          {/* Tabs and Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg mb-4 sm:mb-6 overflow-hidden">
            <div className="flex border-b border-grey-200">
                <button
                  onClick={() => setActiveTab('listings')}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-medium text-sm sm:text-base ${
                    activeTab === 'listings' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-grey-600 hover:text-grey-900'
                  }`}
                >
                  Mes annonces
                </button>
                <button
                  onClick={() => setActiveTab('reviews')}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-medium text-sm sm:text-base ${
                    activeTab === 'reviews' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-grey-600 hover:text-grey-900'
                  }`}
                >
                  Avis reçus
                </button>
                <button
                  onClick={() => setActiveTab('favorites')}
                  className={`flex-1 py-3 sm:py-4 px-4 sm:px-6 text-center font-medium text-sm sm:text-base ${
                    activeTab === 'favorites' 
                      ? 'text-primary border-b-2 border-primary' 
                      : 'text-grey-600 hover:text-grey-900'
                  }`}
                >
                  <Heart className="inline h-4 w-4 mr-1" /> Favoris
                </button>
              </div>
            </div>
            
            {/* Tab Content */}
            {activeTab === 'listings' && (
              userListings.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                  {userListings.map((listing) => (
                    <div key={listing.id} className="relative group">
                      <div className="scale-90 sm:scale-95 lg:scale-100 origin-center">
                        <ListingCard listing={listing} />
                      </div>
                      {/* Status badges compacts */}
                      <div className="absolute top-1 right-1 flex flex-col gap-1">
                        {listing.status === 'pending' && (
                          <span className="text-xs bg-warning-100 text-warning-700 px-1.5 py-0.5 rounded font-medium">
                            En attente
                          </span>
                        )}
                        {listing.status === 'sold' && (
                          <span className="text-xs bg-success-100 text-success-700 px-1.5 py-0.5 rounded font-medium">
                            Vendu
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg p-6 sm:p-8 text-center">
                  <ShoppingBag className="h-12 w-12 sm:h-16 sm:w-16 text-grey-400 mx-auto mb-3 sm:mb-4" />
                  <h3 className="text-lg sm:text-xl font-semibold mb-2">Aucune annonce</h3>
                  <p className="text-grey-600 mb-4 sm:mb-6 text-sm sm:text-base">
                    Vous n'avez pas encore publié d'annonces.
                  </p>
                  <Link to="/create-listing" className="btn-primary text-sm sm:text-base">
                    Publier une annonce
                  </Link>
                </div>
              )
            )}

            {activeTab === 'reviews' && (
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg p-4 sm:p-6">
                {userReviews.length > 0 ? (
                  <div className="space-y-3 sm:space-y-4">
                    {userReviews.map((review) => (
                      <div key={review.id} className="p-3 sm:p-4 border-b border-grey-200 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <User className="h-6 w-6 sm:h-8 sm:w-8 text-primary mr-2 sm:mr-3" />
                            <div>
                              <span className="font-semibold text-grey-800 text-sm sm:text-base">{review.reviewer.full_name}</span>
                              <p className="text-xs sm:text-sm text-grey-500">
                                {formatDate(review.created_at)}
                              </p>
                            </div>
                          </div>
                          {review.listing && (
                            <span className="text-primary text-xs sm:text-sm font-medium">{review.listing.title}</span>
                          )}
                        </div>
                        <div className="text-grey-700 text-sm sm:text-base">
                          {review.comment || 'Aucun commentaire.'}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-grey-500 py-8">
                    <Star className="h-12 w-12 sm:h-16 sm:w-16 text-grey-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Aucun avis reçu pour le moment.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-md lg:shadow-lg p-4 sm:p-6">
                {userFavorites.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
                    {userFavorites.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-grey-500 py-8">
                    <Heart className="h-12 w-12 sm:h-16 sm:w-16 text-grey-400 mx-auto mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base">Aucun favori pour le moment.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Confirmation de suppression */}
        {confirmDeleteId && (
          <div className="fixed inset-0 bg-grey-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg sm:rounded-xl shadow-xl p-4 sm:p-6 max-w-md w-full text-center">
              <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">Supprimer l'annonce ?</h2>
              <p className="text-grey-700 mb-4 sm:mb-6 text-sm sm:text-base">Cette action est irréversible. Voulez-vous vraiment supprimer cette annonce ?</p>
              <div className="flex justify-center gap-3 sm:gap-4">
                <button
                  className="btn-outline text-sm sm:text-base"
                  onClick={() => setConfirmDeleteId(null)}
                  disabled={!!deletingId}
                >
                  Annuler
                </button>
                <button
                  className="btn-primary bg-error-600 hover:bg-error-700 border-error-600 text-sm sm:text-base"
                  onClick={() => handleDeleteListing(confirmDeleteId)}
                  disabled={!!deletingId}
                >
                  Confirmer la suppression
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;