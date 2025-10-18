import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSupabase } from '../../hooks/useSupabase';
import { supabase } from '../../lib/supabase';
import ListingPaymentForm from '../../components/payment/ListingPaymentForm';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { toast } from 'react-hot-toast';

const ListingPaymentPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userProfile } = useSupabase();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<any>(null);

  useEffect(() => {
    const fetchListing = async () => {
      setLoading(true);
      try {
        if (!id) return;
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();
        if (error) throw error;
        setListing(data);
      } catch (error) {
        toast.error('Impossible de charger l\'annonce');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    fetchListing();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-grey-50">
        <div className="bg-white rounded-card shadow-card p-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
          <button className="btn-primary" onClick={() => navigate('/')}>Retour à l'accueil</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-warning-50 to-white flex items-center justify-center py-8 px-2">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8 border border-warning-200">
        <h1 className="text-2xl font-bold text-warning-700 mb-2 text-center">Paiement de l'annonce</h1>
        <p className="text-base text-grey-700 mb-6 text-center">
          Merci de régler les frais de publication (200 FCFA) pour activer votre annonce.<br />
          Un membre de l'équipe validera la publication sous 24h.
        </p>
        <div className="mb-6 flex flex-col items-center">
          <div className="w-24 h-24 rounded-xl overflow-hidden mb-2 border-2 border-warning-200 flex items-center justify-center bg-grey-50">
            <img src={listing.photos?.[0] || 'https://via.placeholder.com/96'} alt={listing.title} className="w-full h-full object-cover" />
          </div>
          <div className="text-lg font-semibold text-grey-900 mb-1">{listing.title}</div>
          <div className="text-warning-700 font-bold">200 FCFA</div>
        </div>
        <ListingPaymentForm
          listingId={listing.id}
          userEmail={user?.email || ''}
          userPhone={userProfile?.phone || ''}
          userFullName={userProfile?.full_name || ''}
          onSuccess={() => {
            toast.success('Preuve envoyée, nous validerons votre annonce rapidement !');
            navigate(`/listings/${listing.id}`);
          }}
        />
        <div className="mt-6 text-center text-grey-500 text-xs">
          Besoin d'aide ? Contactez-nous sur WhatsApp ou par email.<br />
          <a href="mailto:support@daloamarket.shop" className="underline">support@daloamarket.shop</a>
        </div>
      </div>
    </div>
  );
};

export default ListingPaymentPage;
