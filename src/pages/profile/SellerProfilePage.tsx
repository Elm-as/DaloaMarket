import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, AlertCircle, User as UserIcon } from 'lucide-react';
import { useSupabase } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ListingCard from '../../components/listings/ListingCard';

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  reviewer?: {
    full_name: string;
  };
}

const SellerProfilePage: React.FC = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  // const { supabase } = useSupabase(); // On n'utilise plus le supabase du contexte ici
  const navigate = useNavigate();
  const [seller, setSeller] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    console.log('SellerProfilePage sellerId:', sellerId);
    let timeout: NodeJS.Timeout;
    const fetchData = async () => {
      setIsLoading(true);
      setErrorMsg(null);
      // Timeout de sécurité (10s)
      timeout = setTimeout(() => {
        setIsLoading(false);
        setErrorMsg('Chargement trop long. Vérifiez votre connexion ou contactez le support.');
      }, 10000);
      // Récupère le profil vendeur
      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id, full_name, created_at')
        .eq('id', sellerId)
        .single();
      clearTimeout(timeout);
      if (userError) {
        setErrorMsg("Erreur lors du chargement du vendeur : " + userError.message);
        console.error('Erreur vendeur:', userError);
        setIsLoading(false);
        return;
      }
      if (!user) {
        setErrorMsg("Vendeur introuvable.");
        setIsLoading(false);
        return;
      }
      // Récupère les annonces du vendeur
      const { data: userListings } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', sellerId)
        .order('created_at', { ascending: false });
      // Récupère les avis du vendeur (attention : la colonne est reviewed_id)
      const { data: userReviews } = await supabase
        .from('reviews')
        .select('id, rating, comment, created_at, reviewer:users!reviews_reviewer_id_fkey(full_name)')
        .eq('reviewed_id', sellerId)
        .order('created_at', { ascending: false });
      setSeller(user);
      setListings(userListings || []);
      setReviews(userReviews || []);
      setIsLoading(false);
    };
    if (!sellerId) {
      setErrorMsg('Aucun vendeur sélectionné.');
      setIsLoading(false);
      return;
    }
    fetchData();
    return () => clearTimeout(timeout);
  }, [sellerId, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  if (errorMsg) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <div className="bg-white p-8 rounded-card shadow-card text-center">
          <AlertCircle className="mx-auto mb-2 text-error-500" size={32} />
          <p>{errorMsg}</p>
        </div>
      </div>
    );
  }

  // Calcul de la moyenne des notes
  const ratings = reviews.map(r => r.rating);
  const avgRating = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : '—';
  const bestReviews = reviews.filter(r => r.rating >= 3);
  const worstReviews = reviews.filter(r => r.rating < 3);

  const handleReport = () => {
    const subject = encodeURIComponent('Signalement vendeur DaloaMarket');
    const body = encodeURIComponent(`Je souhaite signaler le vendeur avec l'ID : ${seller.id}\nNom : ${seller.full_name}`);
    window.location.href = `mailto:support@daloamarket.shop?subject=${subject}&body=${body}`;
  };

  return (
    <div className="min-h-screen bg-grey-50 py-8">
      <div className="container-custom max-w-3xl">
        <div className="bg-white rounded-card shadow-card p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-grey-100 flex items-center justify-center border border-grey-200 shadow">
              <UserIcon className="h-12 w-12 text-grey-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                {seller.full_name}
                <UserIcon className="text-primary-500" size={22} />
              </h1>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-yellow-500 flex items-center">
                  <Star className="inline-block mr-1" size={18} />
                  {avgRating}
                </span>
                <span className="text-grey-500 text-sm">({ratings.length} avis)</span>
              </div>
              <button
                onClick={handleReport}
                className="btn-outline text-error-600 mt-2"
              >
                Signaler ce vendeur
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-lg font-semibold mb-3">Meilleurs avis</h2>
            {bestReviews.length === 0 ? (
              <p className="text-grey-500 text-sm">Aucun avis positif pour ce vendeur.</p>
            ) : (
              <ul className="space-y-4">
                {bestReviews.map(r => (
                  <li key={r.id} className="bg-grey-50 rounded p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-500" size={16} />
                      ))}
                      {[...Array(5 - r.rating)].map((_, i) => (
                        <Star key={i} className="text-grey-300" size={16} />
                      ))}
                      <span className="ml-2 text-xs text-grey-400">{new Date(r.created_at).toLocaleDateString()}</span>
                      {r.reviewer?.full_name && (
                        <span className="ml-2 text-xs text-grey-500">par {r.reviewer.full_name}</span>
                      )}
                    </div>
                    <div className="text-sm text-grey-800">{r.comment}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold mb-3">Pires avis</h2>
            {worstReviews.length === 0 ? (
              <p className="text-grey-500 text-sm">Aucun mauvais avis pour ce vendeur.</p>
            ) : (
              <ul className="space-y-4">
                {worstReviews.map(r => (
                  <li key={r.id} className="bg-grey-50 rounded p-3 shadow-sm">
                    <div className="flex items-center gap-2 mb-1">
                      {[...Array(r.rating)].map((_, i) => (
                        <Star key={i} className="text-yellow-500" size={16} />
                      ))}
                      {[...Array(5 - r.rating)].map((_, i) => (
                        <Star key={i} className="text-grey-300" size={16} />
                      ))}
                      <span className="ml-2 text-xs text-grey-400">{new Date(r.created_at).toLocaleDateString()}</span>
                      {r.reviewer?.full_name && (
                        <span className="ml-2 text-xs text-grey-500">par {r.reviewer.full_name}</span>
                      )}
                    </div>
                    <div className="text-sm text-grey-800">{r.comment}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-3">Annonces de ce vendeur</h2>
          {listings.length === 0 ? (
            <p className="text-grey-500 text-sm">Aucune annonce publiée par ce vendeur.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {listings.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
