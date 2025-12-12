import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Star, Zap, ArrowRight } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { formatPrice, formatDate } from '../../lib/utils';
import { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];

interface ListingCardProps {
  listing: Listing;
  onPress?: () => void;
  sellerName?: string;
  sellerRating?: number | null;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onPress, sellerName, sellerRating }) => {
  const mainImage = listing.photos && listing.photos.length > 0
    ? listing.photos[0]
    : 'https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=400';

  const isBoostActive = listing.boosted_until && new Date(listing.boosted_until) > new Date();
  const prefersReducedMotion = useReducedMotion();
  const [imgLoaded, setImgLoaded] = useState(false);

  const CardInner = () => (
    <article className="group bg-white rounded-lg sm:rounded-xl lg:rounded-2xl shadow-sm overflow-hidden border border-grey-100" role="article">
      <div className="relative aspect-[4/3] md:aspect-square overflow-hidden bg-grey-100">
        <div className={`absolute inset-0 bg-gradient-to-r from-grey-200 to-grey-100 ${imgLoaded ? 'opacity-0' : 'opacity-100'} ${prefersReducedMotion ? '' : 'animate-pulse'} transition-opacity duration-300`} aria-hidden="true" />
        <img src={mainImage} alt={listing.title} loading="lazy" decoding="async" onLoad={() => setImgLoaded(true)} className={`w-full h-full object-cover ${imgLoaded ? 'opacity-100' : 'opacity-0'} group-hover:scale-105 transition-all duration-300 will-change-transform`} />

        {isBoostActive && (
          <div className="absolute top-2 left-2 bg-gradient-to-r from-primary to-primary-600 text-white text-xs font-bold px-2 py-0.5 rounded-full flex items-center shadow-md">
            <Zap className="h-3 w-3 mr-1" />
            <span className="hidden sm:inline">Sponsorisé</span>
            <span className="sm:hidden">Boost</span>
          </div>
        )}

        {listing.status === 'sold' && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-error-600 text-white px-3 py-1 rounded-full font-bold text-xs">VENDU</span>
          </div>
        )}

        {listing.photos && listing.photos.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-0.5 rounded-full">{listing.photos.length}</div>
        )}
      </div>

      <div className="p-3 sm:p-3 lg:p-4 space-y-1.5 sm:space-y-2">
        <div className="space-y-1">
          <h3 className="font-semibold text-grey-900 line-clamp-2 text-sm md:text-base leading-tight group-hover:text-primary transition-colors">{listing.title}</h3>
          <p className="text-lg sm:text-xl font-bold text-primary">{formatPrice(listing.price)}</p>
        </div>

        <div className="flex items-center justify-between text-xs text-grey-600">
          <div className="flex items-center min-w-0 flex-1">
            <MapPin className="h-3 w-3 mr-1 text-grey-400 flex-shrink-0" />
            <span className="truncate">{listing.district}</span>
          </div>
          <div className="flex items-center ml-2 flex-shrink-0">
            <Clock className="h-3 w-3 mr-1 text-grey-400" />
            <span className="text-xs">{formatDate(listing.created_at)}</span>
          </div>
        </div>

        {sellerName && (
          <div className="flex items-center justify-between pt-2 border-t border-grey-100">
            <span className="text-xs text-grey-800 font-semibold truncate flex-1" title={`Voir l'annonce de ${sellerName}`}>{sellerName}</span>

            {sellerRating && (
              <div className="flex items-center ml-2 flex-shrink-0">
                <Star className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium ml-0.5">{sellerRating.toFixed(1)}</span>
              </div>
            )}

            <div className="ml-3 flex-shrink-0">
              <span className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-primary text-white shadow-md">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
                <span className="sr-only">Voir l'annonce</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </article>
  );

  const interactiveClass = 'w-full block text-left rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

  if (onPress) {
    return (
      <button type="button" onClick={onPress} className={`${interactiveClass} active:scale-98`} aria-label={`Ouvrir l'annonce ${listing.title}`}>
        <motion.div whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
          <CardInner />
        </motion.div>
      </button>
    );
  }

  return (
    <Link to={`/listings/${listing.id}`} className={`${interactiveClass} ${prefersReducedMotion ? '' : 'hover:shadow-lg'}`} aria-label={`Voir ${listing.title} — ${formatPrice(listing.price)}`}>
      <motion.div whileHover={prefersReducedMotion ? undefined : { y: -6, scale: 1.02 }} whileTap={prefersReducedMotion ? undefined : { scale: 0.985 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
        <CardInner />
      </motion.div>
    </Link>
  );
};

export default ListingCard;