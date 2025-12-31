import React, { useState, useEffect, Suspense } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { 
  MapPin, 
  Calendar, 
  Star, 
  MessageSquare, 
  Flag, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  User // Correction : ajout de l'import User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useSupabase } from '../../hooks/useSupabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  formatPrice, 
  formatDate,
  getConditionLabel,
  getCategoryLabel
} from '../../lib/utils';
import { Database } from '../../lib/database.types';
import ReviewForm from '../../components/listings/ReviewForm';
import ListingPaymentForm from '../../components/payment/ListingPaymentForm';

type Listing = Database['public']['Tables']['listings']['Row'];
type SellerProfile = Database['public']['Tables']['users']['Row'];

interface ListingWithSeller extends Listing {
  seller: SellerProfile;
}

const ListingDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user, userProfile } = useSupabase();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<ListingWithSeller | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);
  const [markingAsSold, setMarkingAsSold] = useState(false);
  // Ajout des hooks pour la gestion des actions d'annonce (modification prix, suppression)
  const [editingPrice, setEditingPrice] = useState(false);
  const [newPrice, setNewPrice] = useState<number | null>(null);
  const [isUpdatingPrice, setIsUpdatingPrice] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  // Ajout du state pour les annonces similaires (nécessaire pour la sidebar)
  const [similarListings, setSimilarListings] = useState<Listing[]>([]);
  
  useEffect(() => {
    const fetchListing = async () => {
      try {
        if (!id) return;
        
        // Fetch both listing and similar listings in parallel
        const [listingResult, similarResult] = await Promise.all([
          supabase
            .from('listings')
            .select(`
              *,
              seller:users!listings_user_id_fkey (*)
            `)
            .eq('id', id)
            .single(),
          supabase
            .from('listings')
            .select('*')
            .eq('status', 'active')
            .neq('id', id)
            .limit(4)
        ]);
        
        if (listingResult.error) throw listingResult.error;
        
        const listingData = listingResult.data as ListingWithSeller;
        setListing(listingData);
        
        // Filter similar listings by category from the results
        if (similarResult.data) {
          const similar = similarResult.data.filter(l => l.category === listingData.category);
          setSimilarListings(similar);
        }
      } catch (error) {
        console.error('Error fetching listing:', error);
        toast.error('Impossible de charger cette annonce');
      } finally {
        setLoading(false);
      }
    };
    
    fetchListing();
  }, [id]);
  
  const nextImage = () => {
    if (!listing?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === listing.photos.length - 1 ? 0 : prev + 1
    );
  };
  
  const prevImage = () => {
    if (!listing?.photos) return;
    setCurrentImageIndex((prev) => 
      prev === 0 ? listing.photos.length - 1 : prev - 1
    );
  };
  
  const handleReportListing = async () => {
    if (!reportReason.trim()) {
      toast.error('Veuillez indiquer une raison');
      return;
    }
    
    setIsSubmittingReport(true);
    
    try {
      // In a real app, you would save this report to the database
      // For now, we'll just simulate a successful report
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Annonce signalée avec succès');
      setReportModalOpen(false);
      setReportReason('');
    } catch (error) {
      console.error('Error reporting listing:', error);
      toast.error('Erreur lors du signalement');
    } finally {
      setIsSubmittingReport(false);
    }
  };
  
  // Fonction pour marquer comme vendu
  async function handleMarkAsSold() {
    if (!listing) return;
    setMarkingAsSold(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status: 'sold' })
        .eq('id', listing.id);
      if (error) throw error;
      toast.success('Annonce marquée comme vendue');
      setListing({ ...listing, status: 'sold' });
    } catch {
      toast.error('Erreur lors du marquage comme vendue');
    } finally {
      setMarkingAsSold(false);
    }
  }
  
  // Fonction pour modifier le prix
  async function handleUpdatePrice() {
    if (!listing || newPrice === null) return;
    setIsUpdatingPrice(true);
    try {
      const { error } = await supabase
        .from('listings')
        .update({ price: newPrice })
        .eq('id', listing.id);
      if (error) throw error;
      toast.success('Prix modifié avec succès');
      setListing({ ...listing, price: newPrice });
      setEditingPrice(false);
    } catch {
      toast.error('Erreur lors de la modification du prix');
    } finally {
      setIsUpdatingPrice(false);
    }
  }

  // Fonction de suppression d'annonce
  async function handleDeleteListing() {
    if (!listing) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', listing.id);
      if (error) throw error;
      toast.success('Annonce supprimée');
      navigate('/profile');
    } catch {
      toast.error('Erreur lors de la suppression');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  }

  const handleContactSeller = () => {
    if (!user) {
      toast.error('Vous devez être connecté pour contacter le vendeur');
      navigate('/login', { state: { from: `/listings/${id}` } });
      return;
    }
    if (listing?.seller.id === user.id) {
      toast.error('Vous ne pouvez pas contacter votre propre annonce');
      return;
    }
    navigate(`/messages/${listing?.id}/${listing?.seller.id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-grey-50 flex items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    );
  }
  
  if (!listing) {
    return (
      <div className="min-h-screen bg-grey-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-card shadow-card p-8 text-center">
            <AlertCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Annonce introuvable</h1>
            <p className="text-grey-600 mb-6">
              Cette annonce n'existe pas ou a été supprimée.
            </p>
            <Link to="/" className="btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (
    listing &&
    listing.status !== 'active' &&
    (!user || user.id !== listing.user_id)
  ) {
    return (
      <div className="min-h-screen bg-grey-50 py-12">
        <div className="container-custom max-w-4xl">
          <div className="bg-white rounded-card shadow-card p-8 text-center">
            <AlertCircle className="h-16 w-16 text-error-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Annonce non disponible</h1>
            <p className="text-grey-600 mb-6">
              Cette annonce n'est pas accessible. Elle a peut-être été déjà vendue, supprimée, ou vous n'avez pas l'autorisation pour la consulter.<br />
              <span className="block mt-2 text-sm text-grey-500">Si vous pensez qu'il s'agit d'une erreur, contactez le <a href="mailto:support@daloamarket.shop" className="text-grey-800 hover:text-primary transition-colors">
                  support
                </a> ou vérifiez l'état de l'annonce dans l'espace personnel du vendeur.</span>
            </p>
            <Link to="/" className="btn-primary">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-grey-50 py-4 sm:py-6 lg:py-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Image Gallery */}
            <div className="bg-white rounded-card shadow-card overflow-hidden mb-6">
              <div className="relative aspect-video bg-grey-100">
                {listing.photos && listing.photos.length > 0 ? (
                  <>
                    <img 
                      src={listing.photos[currentImageIndex]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover"
                    />
                    
                    {listing.photos.length > 1 && (
                      <>
                        <button 
                          onClick={prevImage}
                          className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-opacity-100 transition-all touch-target focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Image précédente"
                        >
                          <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6 text-grey-800" />
                        </button>
                        
                        <button 
                          onClick={nextImage}
                          className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-opacity-100 transition-all touch-target focus:outline-none focus:ring-2 focus:ring-primary"
                          aria-label="Image suivante"
                        >
                          <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6 text-grey-800" />
                        </button>
                        
                        <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-1.5 sm:space-x-2">
                          {listing.photos.map((_, index) => (
                            <button
                              key={index}
                              onClick={() => setCurrentImageIndex(index)}
                              className={`p-2 touch-target focus:outline-none focus:ring-2 focus:ring-primary rounded-full ${
                                index === currentImageIndex ? 'bg-primary scale-125' : 'bg-white bg-opacity-60'
                              }`}
                              aria-label={`Voir image ${index + 1}`}
                              aria-current={index === currentImageIndex ? 'true' : 'false'}
                            >
                              <span className={`block h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full transition-all ${
                                index === currentImageIndex ? 'bg-white' : 'bg-current'
                              }`} />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-grey-100">
                    <p className="text-grey-500">Aucune image disponible</p>
                  </div>
                )}
              </div>
              
              {/* Thumbnails */}
              {listing.photos && listing.photos.length > 1 && (
                <div className="p-3 sm:p-4 flex space-x-2 overflow-x-auto smooth-scroll">
                  {listing.photos.map((photo, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-md overflow-hidden border-2 transition-all ${
                        index === currentImageIndex ? 'border-primary scale-105' : 'border-grey-200'
                      }`}
                    >
                      <img 
                        src={photo} 
                        alt={`Thumbnail ${index + 1}`} 
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            {/* Listing Details */}
            <div className="bg-white rounded-card shadow-card p-4 sm:p-6 mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-grey-900 mb-2">{listing.title}</h1>
              
              <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4">
                {formatPrice(listing.price)}
              </p>
              
              <div className="flex flex-wrap gap-y-2 gap-x-4 mb-6 text-sm sm:text-base">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-grey-500 mr-1 flex-shrink-0" />
                  <span className="text-grey-700">{listing.district}</span>
                </div>
                
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-grey-500 mr-1 flex-shrink-0" />
                  <span className="text-grey-700">{formatDate(listing.created_at)}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
                <div className="bg-grey-50 p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-grey-500 mb-1">Catégorie</p>
                  <p className="font-medium text-sm sm:text-base">{getCategoryLabel(listing.category)}</p>
                </div>
                
                <div className="bg-grey-50 p-3 rounded-lg">
                  <p className="text-xs sm:text-sm text-grey-500 mb-1">État</p>
                  <p className="font-medium text-sm sm:text-base">{getConditionLabel(listing.condition)}</p>
                </div>
              </div>
              
              <div className="mb-6">
                <h2 className="text-base sm:text-lg lg:text-xl font-semibold mb-2 sm:mb-3">Description</h2>
                <p className="text-grey-700 whitespace-pre-line text-sm sm:text-base leading-relaxed">{listing.description}</p>
              </div>

              {/* Bloc avis : affic hé si l'utilisateur est connecté, n'est pas le vendeur, et n'a pas déjà noté ce vendeur pour cette annonce */}
              {user?.id && user.id !== listing.seller.id && (
                <ReviewForm listingId={listing.id} reviewedId={listing.seller.id} />
              )}

              <div className="flex justify-end">
                <button
                  onClick={() => setReportModalOpen(true)}
                  className="text-grey-500 flex items-center text-sm hover:text-error-600 transition-colors"
                >
                  <Flag className="h-4 w-4 mr-1" />
                  Signaler l'annonce
                </button>
              </div>
              
              {/* Marquer comme vendu, modifier prix, supprimer (actions propriétaire) */}
              {user?.id && listing && user.id === listing.seller.id && (listing.status === 'active' || listing.status === 'pending') && (
                <div className="flex flex-col gap-2 mb-4">
                  {listing.status === 'active' && (
                    <button
                      className="btn-outline btn-xs text-success-700 border-success-700 hover:bg-success-50"
                      onClick={handleMarkAsSold}
                      disabled={markingAsSold}
                    >
                      {markingAsSold ? 'Traitement...' : 'Marquer comme vendu'}
                    </button>
                  )}
                  {/* Modifier le prix (uniquement si active) */}
                  {listing.status === 'active' && (editingPrice ? (
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min={200}
                        step={100}
                        value={newPrice ?? listing.price}
                        onChange={e => setNewPrice(Number(e.target.value))}
                        className="input-field w-28 border-primary-300 focus:border-primary-500 rounded-lg"
                        disabled={isUpdatingPrice}
                      />
                      <button
                        className="btn-primary btn-xs"
                        onClick={handleUpdatePrice}
                        disabled={isUpdatingPrice}
                      >
                        {isUpdatingPrice ? 'Mise à jour...' : 'Valider'}
                      </button>
                      <button
                        className="btn-outline btn-xs"
                        onClick={() => setEditingPrice(false)}
                        disabled={isUpdatingPrice}
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <button
                      className="btn-outline btn-xs hover:bg-primary-50 border-primary-200 text-primary"
                      onClick={() => {
                        setEditingPrice(true);
                        setNewPrice(listing.price);
                      }}
                    >
                      Modifier le prix
                    </button>
                  ))}
                  {/* Supprimer l'annonce (active ou pending) */}
                  <button
                    className="btn-outline btn-xs text-error-700 border-error-700 hover:bg-error-50"
                    onClick={() => setConfirmDelete(true)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? 'Suppression...' : 'Supprimer'}
                  </button>
                </div>
              )}
              {/* Confirmation de suppression */}
              {confirmDelete && (
                <div className="fixed inset-0 bg-grey-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-card shadow-card p-6 max-w-md w-full text-center">
                    <h2 className="text-xl font-bold mb-4">Supprimer l'annonce ?</h2>
                    <p className="text-grey-700 mb-6">Cette action est irréversible. Voulez-vous vraiment supprimer cette annonce ?</p>
                    <div className="flex justify-center gap-4">
                      <button
                        className="btn-outline"
                        onClick={() => setConfirmDelete(false)}
                        disabled={isDeleting}
                      >
                        Annuler
                      </button>
                      <button
                        className="btn-primary bg-error-600 hover:bg-error-700 border-error-600"
                        onClick={handleDeleteListing}
                        disabled={isDeleting}
                      >
                        Confirmer la suppression
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/* Affichage du bouton "Payer maintenant" si l'annonce est en attente de paiement et que l'utilisateur est le propriétaire */}
              {user?.id && listing && user.id === listing.seller.id && listing.status === 'pending' && (
                <div className="my-6 flex flex-col items-center">
                  <div className="mb-4 text-lg text-warning-700 font-semibold">
                    Cette annonce est en attente de paiement. Elle ne sera pas visible tant que le paiement n'est pas effectué.
                  </div>
                  <button
                    className="btn-primary w-full max-w-md text-center py-3 text-lg font-semibold rounded-xl shadow-card border border-warning-200 bg-warning-500 hover:bg-warning-600 text-white transition mb-2"
                    onClick={() => navigate(`/paiement-annonce/${listing.id}`)}
                  >
                    <span role="img" aria-label="paiement">💳</span> Payer maintenant pour publier
                  </button>
                  <div className="mt-2 text-base text-grey-600 text-center">
                    Toutes les informations de l'annonce seront pré-remplies, y compris le boost si sélectionné.
                  </div>
                </div>
              )}

            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Seller Info */}
            <div className="bg-white rounded-card shadow-card p-4 sm:p-6 mb-6">
              <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Vendeur</h2>
              
              <div className="flex items-center mb-4">
                <Link to={`/profile/seller/${listing.seller.id}`} className="flex items-center group">
                  {listing.seller.avatar_url ? (
                    <img
                      src={listing.seller.avatar_url}
                      alt={listing.seller.full_name}
                      className="h-12 w-12 rounded-full object-cover border border-grey-200 shadow"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-grey-100 flex items-center justify-center">
                      <User className="h-6 w-6 text-grey-500" />
                    </div>
                  )}
                  <div className="ml-3">
                    <span className="font-medium text-primary group-hover:underline cursor-pointer">{listing.seller.full_name}</span>
                    {listing.seller.rating && (
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-primary fill-current" />
                        <span className="text-sm ml-1">{listing.seller.rating.toFixed(1)}</span>
                      </div>
                    )}
                  </div>
                </Link>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-grey-500">Quartier</p>
                <p className="font-medium">{listing.seller.district}</p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-grey-500">Membre depuis</p>
                <p className="font-medium">{formatDate(listing.seller.created_at)}</p>
              </div>
              
              <button
                onClick={handleContactSeller}
                className="btn-primary w-full flex items-center justify-center mb-2 min-h-[44px] text-sm sm:text-base"
                disabled={listing.seller.id === user?.id}
              >
                <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                <span className="truncate">Contacter le vendeur (chat)</span>
              </button>
              {listing.seller.phone && (
                <a
                  href={`https://wa.me/${(() => {
                    const phone = listing.seller.phone.replace(/[^\d]/g, '');
                    if (phone.startsWith('225')) return phone;
                    if (phone.length === 10 && phone.startsWith('0')) return '225' + phone;
                    if (phone.length === 8) return '2250' + phone;
                    if (phone.length > 10 && !phone.startsWith('225')) return phone;
                    return phone;
                  })()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center px-4 py-2.5 sm:py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition mb-2 min-h-[44px] text-sm sm:text-base"
                  title="Contacter sur WhatsApp"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 14.487c-.297-.149-1.758-.867-2.03-.967-.273-.099-.472-.148-.67.15-.198.297-.767.967-.94 1.165-.173.198-.347.223-.644.075-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.21-.242-.58-.487-.501-.67-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.099 3.21 5.077 4.377.71.306 1.263.489 1.695.626.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.288.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12c0-4.97-4.03-9-9-9s-9 4.03-9 9c0 1.591.418 3.086 1.144 4.375L3 21l4.755-1.244A8.963 8.963 0 0012 21c4.97 0 9-4.03 9-9z" />
                  </svg>
                  <span className="truncate">Contacter sur WhatsApp</span>
                </a>
              )}
              {listing.seller.id === user?.id && (
                <p className="text-sm text-grey-500 text-center mt-2">
                  C'est votre annonce
                </p>
              )}
            </div>
            
            {/* Similar Listings */}
            {similarListings.length > 0 && (
              <div className="bg-white rounded-card shadow-card p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Annonces similaires</h2>
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  {similarListings.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/listings/${item.id}`}
                      className="flex flex-col items-center hover:bg-grey-50 p-2 sm:p-3 rounded-lg transition-colors border border-grey-100 min-h-[120px]"
                    >
                      <div className="h-20 sm:h-24 w-full rounded-md overflow-hidden flex-shrink-0 mb-2 flex items-center justify-center bg-grey-50">
                        <img 
                          src={item.photos[0] || 'https://via.placeholder.com/96'} 
                          alt={item.title} 
                          className="h-full w-auto max-w-full object-cover"
                        />
                      </div>
                      <div className="w-full text-center">
                        <p className="font-medium line-clamp-2 text-xs sm:text-sm mb-1">{item.title}</p>
                        <p className="text-primary font-bold text-sm sm:text-base">{formatPrice(item.price)}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Report Modal */}
      {reportModalOpen && (
        <div className="fixed inset-0 bg-grey-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-card shadow-card p-6 max-w-md w-full">
            <h2 className="text-xl font-bold mb-4">Signaler l'annonce</h2>
            
            <p className="text-grey-600 mb-4">
              Veuillez indiquer la raison pour laquelle vous signalez cette annonce.
            </p>
            
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="input-field mb-4"
              disabled={isSubmittingReport}
            >
              <option value="">Sélectionnez une raison</option>
              <option value="fake">Annonce frauduleuse</option>
              <option value="inappropriate">Contenu inapproprié</option>
              <option value="duplicate">Annonce en double</option>
              <option value="wrong_category">Mauvaise catégorie</option>
              <option value="other">Autre raison</option>
            </select>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setReportModalOpen(false)}
                className="btn-outline"
                disabled={isSubmittingReport}
              >
                Annuler
              </button>
              
              <button
                onClick={handleReportListing}
                className="btn-primary flex items-center"
                disabled={isSubmittingReport || !reportReason}
              >
                {isSubmittingReport ? (
                  <LoadingSpinner size="small" className="text-white" />
                ) : (
                  <>
                    <Flag className="h-4 w-4 mr-2" />
                    Signaler
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListingDetailPage;