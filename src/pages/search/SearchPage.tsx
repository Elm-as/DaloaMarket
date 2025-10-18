import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Filter,  
  Clock, 
  X,
  AlertCircle,
  Grid3X3,
  List
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import SearchBar from '../../components/search/SearchBar';
import ListingCard from '../../components/listings/ListingCard';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import { 
  CATEGORIES, 
  CONDITIONS, 
  DISTRICTS, 
  formatPrice 
} from '../../lib/utils';
import { Database } from '../../lib/database.types';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingWithSeller = Listing & { seller_name: string; seller_rating: number | null };

interface FilterState {
  category: string;
  condition: string;
  district: string;
  minPrice: string;
  maxPrice: string;
}

const SearchPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [sortBy, setSortBy] = useState('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // Suppression du mode d'affichage, grille uniquement
  
  // Les filtres sont lus dynamiquement depuis l'URL à chaque rendu
  const filters: FilterState = {
    category: queryParams.get('category') || '',
    condition: queryParams.get('condition') || '',
    district: queryParams.get('district') || '',
    minPrice: queryParams.get('minPrice') || '',
    maxPrice: queryParams.get('maxPrice') || '',
  };
  
  const searchQuery = queryParams.get('q') || '';
  const ITEMS_PER_PAGE = 12;
  

  const {
    category,
    condition,
    district,
    minPrice,
    maxPrice
  } = filters;

  const fetchListings = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      let query = supabase
        .from('listings')
        .select(`
          *,
          users:user_id (
            full_name,
            rating
          )
        `, { count: 'exact' })
        .eq('status', 'active')
        .order(sortBy, { ascending: sortOrder === 'asc' });
      if (searchQuery) {
        // Recherche fuzzy : tolère fautes et mots incomplets (ILIKE)
        // Pour une recherche encore plus intelligente, activer pg_trgm côté DB
        query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      if (category) {
        query = query.eq('category', category);
      }
      if (condition) {
        query = query.eq('condition', condition);
      }
      if (district) {
        query = query.eq('district', district);
      }
      if (minPrice) {
        query = query.gte('price', parseInt(minPrice));
      }
      if (maxPrice) {
        query = query.lte('price', parseInt(maxPrice));
      }
      const from = (pageNumber - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;
      query = query.range(from, to);
      const { data, error, count } = await query;
      if (error) throw error;
      const formattedListings = data.map(item => ({
        ...item,
        seller_name: item.users?.full_name || 'Utilisateur',
        seller_rating: item.users?.rating || null
      }));
      if (pageNumber === 1) {
        setListings(formattedListings);
      } else {
        setListings(prev => [...prev, ...formattedListings]);
      }
      if (count !== null) {
        setTotalCount(count);
        setHasMore(from + formattedListings.length < count);
      }
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setLoading(false);
    }
  }, [sortBy, sortOrder, searchQuery, category, condition, district, minPrice, maxPrice]);

  useEffect(() => {
    setPage(1);
    fetchListings(1);
  }, [location.search, sortBy, sortOrder, fetchListings]);
  
  // fetchListings est maintenant dans useCallback
  
  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchListings(nextPage);
  };
  
  const handleSortChange = (value: string) => {
    if (value === 'price_asc') {
      setSortBy('price');
      setSortOrder('asc');
    } else if (value === 'price_desc') {
      setSortBy('price');
      setSortOrder('desc');
    } else {
      setSortBy('created_at');
      setSortOrder('desc');
    }
  };
  
  // Change un filtre et met à jour l'URL instantanément
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    const params = new URLSearchParams(location.search);
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    navigate(`/search?${params.toString()}`);
  };
  
  // Applique les filtres (ferme juste le modal, car l'URL est déjà à jour)
  const applyFilters = () => {
    setIsFilterOpen(false);
  };
  
  const resetFilters = () => {
    if (searchQuery) {
      navigate(`/search?q=${searchQuery}`);
    } else {
      navigate('/search');
    }
    setIsFilterOpen(false);
  };
  
  const getCategoryLabel = (id: string) => {
    const category = CATEGORIES.find(c => c.id === id);
    return category ? category.label : '';
  };
  
  const getConditionLabel = (id: string) => {
    const condition = CONDITIONS.find(c => c.id === id);
    return condition ? condition.label : '';
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-grey-50 to-grey-100">
      <div className="container-custom py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar initialQuery={searchQuery} selectedCategory={filters.category} />
        </div>
        
        {/* Filters and Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
            {/* Left side - Filters */}
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={() => setIsFilterOpen(true)}
                className="btn-outline flex items-center gap-2 px-4 py-2"
              >
                <Filter className="h-4 w-4" />
                Filtres
                {(filters.category || filters.condition || filters.district || filters.minPrice || filters.maxPrice) && (
                  <span className="bg-primary text-white text-xs rounded-full px-2 py-0.5 ml-1">
                    {[filters.category, filters.condition, filters.district, filters.minPrice || filters.maxPrice].filter(Boolean).length}
                  </span>
                )}
              </button>
              
              {/* Active Filters */}
              <div className="flex flex-wrap gap-2">
                {filters.category && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {getCategoryLabel(filters.category)}
                    <button 
                      onClick={() => {
                        const newFilters = { ...filters, category: '' };
                        setFilters(newFilters);
                        const params = new URLSearchParams(location.search);
                        params.delete('category');
                        navigate(`/search?${params.toString()}`);
                      }}
                      className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.condition && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {getConditionLabel(filters.condition)}
                    <button 
                      onClick={() => {
                        const newFilters = { ...filters, condition: '' };
                        setFilters(newFilters);
                        const params = new URLSearchParams(location.search);
                        params.delete('condition');
                        navigate(`/search?${params.toString()}`);
                      }}
                      className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {filters.district && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    {filters.district}
                    <button 
                      onClick={() => {
                        const newFilters = { ...filters, district: '' };
                        setFilters(newFilters);
                        const params = new URLSearchParams(location.search);
                        params.delete('district');
                        navigate(`/search?${params.toString()}`);
                      }}
                      className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
                
                {(filters.minPrice || filters.maxPrice) && (
                  <div className="bg-primary-100 text-primary-700 px-3 py-1 rounded-full text-sm flex items-center">
                    Prix: {filters.minPrice ? formatPrice(parseInt(filters.minPrice)) : '0'} 
                    {' - '} 
                    {filters.maxPrice ? formatPrice(parseInt(filters.maxPrice)) : '∞'}
                    <button 
                      onClick={() => {
                        const newFilters = { ...filters, minPrice: '', maxPrice: '' };
                        setFilters(newFilters);
                        const params = new URLSearchParams(location.search);
                        params.delete('minPrice');
                        params.delete('maxPrice');
                        navigate(`/search?${params.toString()}`);
                      }}
                      className="ml-2 hover:bg-primary-200 rounded-full p-0.5"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>
              
              {(filters.category || filters.condition || filters.district || filters.minPrice || filters.maxPrice) && (
                <button 
                  onClick={resetFilters}
                  className="text-grey-600 text-sm hover:text-grey-900 transition-colors underline"
                >
                  Tout effacer
                </button>
              )}
            </div>
            
            {/* Right side - Sort and View */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-grey-600 text-sm">Trier par:</span>
                <select
                  className="input-field py-2 text-sm min-w-0"
                  value={sortBy === 'created_at' ? 'newest' : sortBy === 'price' && sortOrder === 'asc' ? 'price_asc' : 'price_desc'}
                  onChange={(e) => handleSortChange(e.target.value)}
                >
                  <option value="newest">Plus récent</option>
                  <option value="price_asc">Prix croissant</option>
                  <option value="price_desc">Prix décroissant</option>
                </select>
              </div>
              
              {/* Suppression du choix d'affichage grille/liste */}
            </div>
          </div>
        </div>
        
        {/* Results Count */}
        <div className="mb-6">
          <p className="text-grey-600 text-lg">
            <span className="font-semibold text-grey-900">{totalCount}</span> résultat{totalCount !== 1 ? 's' : ''}
            {searchQuery && (
              <span> pour <span className="font-semibold text-primary">"{searchQuery}"</span></span>
            )}
          </p>
        </div>
        
        {/* Listings Grid/List */}
        {loading && page === 1 ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : listings.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
              {listings.map((listing) => (
                <ListingCard 
                  key={listing.id} 
                  listing={listing} 
                  sellerName={listing.seller_name}
                  sellerRating={listing.seller_rating}
                />
              ))}
            </div>
            {/* Load More */}
            {hasMore && (
              <div className="mt-12 text-center">
                <button
                  onClick={loadMore}
                  className="btn-outline flex items-center mx-auto px-8 py-3 text-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <LoadingSpinner size="small" className="mr-2" />
                  ) : (
                    <Clock className="h-5 w-5 mr-2" />
                  )}
                  Charger plus d'annonces
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-20 w-20 text-grey-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold mb-4">Aucune annonce trouvée</h3>
            <p className="text-grey-600 mb-8 text-lg">
              Aucune annonce ne correspond à votre recherche. Essayez de modifier vos filtres ou votre recherche.
            </p>
            <button
              onClick={resetFilters}
              className="btn-primary text-lg px-8 py-4"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
      
      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Filtres</h2>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-2 rounded-xl text-grey-500 hover:text-grey-700 hover:bg-grey-100 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label htmlFor="category" className="input-label text-base font-semibold">
                  Catégorie
                </label>
                <select
                  id="category"
                  name="category"
                  className="input-field"
                  value={filters.category}
                  onChange={handleFilterChange}
                >
                  <option value="">Toutes les catégories</option>
                  {CATEGORIES.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="condition" className="input-label text-base font-semibold">
                  État
                </label>
                <select
                  id="condition"
                  name="condition"
                  className="input-field"
                  value={filters.condition}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les états</option>
                  {CONDITIONS.map((condition) => (
                    <option key={condition.id} value={condition.id}>
                      {condition.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="district" className="input-label text-base font-semibold">
                  Quartier
                </label>
                <select
                  id="district"
                  name="district"
                  className="input-field"
                  value={filters.district}
                  onChange={handleFilterChange}
                >
                  <option value="">Tous les quartiers</option>
                  {DISTRICTS.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="input-label text-base font-semibold">Prix (FCFA)</label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Prix min"
                      className="input-field"
                      value={filters.minPrice}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Prix max"
                      className="input-field"
                      value={filters.maxPrice}
                      onChange={handleFilterChange}
                      min="0"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={resetFilters}
                className="btn-outline flex-1 py-3"
              >
                Réinitialiser
              </button>
              
              <button
                onClick={applyFilters}
                className="btn-primary flex-1 py-3"
              >
                Appliquer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchPage;