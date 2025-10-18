import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList,
  Modal,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ListingCard from '../../components/listings/ListingCard';
import { CATEGORIES, CONDITIONS, DISTRICTS } from '../../lib/utils';
import { Database } from '../../lib/database.types';
import Toast from 'react-native-toast-message';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingWithSeller = Listing & { seller_name: string; seller_rating: number | null };

interface FilterState {
  category: string;
  condition: string;
  district: string;
  minPrice: string;
  maxPrice: string;
}

export default function SearchScreen() {
  const params = useLocalSearchParams();
  const [listings, setListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState((params.q as string) || '');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  
  const [filters, setFilters] = useState<FilterState>({
    category: (params.category as string) || '',
    condition: (params.condition as string) || '',
    district: (params.district as string) || '',
    minPrice: (params.minPrice as string) || '',
    maxPrice: (params.maxPrice as string) || '',
  });

  useEffect(() => {
    fetchListings();
  }, [searchQuery, filters]);

  const fetchListings = async () => {
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
        .order('created_at', { ascending: false });
      
      if (searchQuery) {
        query = query.ilike('title', `%${searchQuery}%`);
      }
      
      if (filters.category) {
        query = query.eq('category', filters.category);
      }
      
      if (filters.condition) {
        query = query.eq('condition', filters.condition);
      }
      
      if (filters.district) {
        query = query.eq('district', filters.district);
      }
      
      if (filters.minPrice) {
        query = query.gte('price', parseInt(filters.minPrice));
      }
      
      if (filters.maxPrice) {
        query = query.lte('price', parseInt(filters.maxPrice));
      }
      
      const { data, error, count } = await query;
      
      if (error) throw error;
      
      const formattedListings = data.map(item => ({
        ...item,
        seller_name: item.users?.full_name || 'Utilisateur',
        seller_rating: item.users?.rating || null
      }));
      
      setListings(formattedListings);
      setTotalCount(count || 0);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les annonces'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    fetchListings();
  };

  const applyFilters = () => {
    setIsFilterOpen(false);
    fetchListings();
  };

  const resetFilters = () => {
    setFilters({
      category: '',
      condition: '',
      district: '',
      minPrice: '',
      maxPrice: '',
    });
    setIsFilterOpen(false);
  };

  const handleListingPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const renderListingItem = ({ item }: { item: ListingWithSeller }) => (
    <ListingCard
      listing={item}
      onPress={() => handleListingPress(item.id)}
      sellerName={item.seller_name}
      sellerRating={item.seller_rating}
    />
  );

  return (
    <>
      {/* Header visuel sans barre de recherche */}
      <View style={{ backgroundColor: '#fff', paddingTop: 24, paddingBottom: 12, paddingHorizontal: 20, borderBottomWidth: 0, borderColor: '#F3F4F6', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1F2937', letterSpacing: 0.5 }}>Recherche</Text>
        <Text style={{ color: '#6B7280', marginTop: 8, fontSize: 13, textAlign: 'center' }}>
          {totalCount} résultat{totalCount !== 1 ? 's' : ''}
        </Text>
      </View>
      {/* Barre de recherche principale */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, width: '92%', alignSelf: 'center', marginTop: 16, marginBottom: 4 }}>
        <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
        <TextInput
          style={{ flex: 1, fontSize: 16, color: '#111827', paddingVertical: 0, backgroundColor: 'transparent' }}
          placeholder="Rechercher une annonce..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 6 }}>
          <Ionicons name="arrow-forward-circle" size={24} color="#FF7F00" />
        </TouchableOpacity>
        <TouchableOpacity
          style={{ marginLeft: 10, backgroundColor: '#FF7F00', borderRadius: 12, padding: 8 }}
          onPress={() => setIsFilterOpen(true)}
          accessibilityLabel="Ouvrir les filtres"
        >
          <Ionicons name="options" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Résultats */}
      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <LoadingSpinner />
        </View>
      ) : listings.length > 0 ? (
        <FlatList
          data={listings}
          keyExtractor={(item) => item.id}
          renderItem={renderListingItem}
          contentContainerStyle={{ padding: 14, paddingBottom: 32, gap: 12 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Ionicons name="search-outline" size={56} color="#9CA3AF" />
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 16, marginBottom: 6, color: '#1F2937' }}>Aucune annonce trouvée</Text>
          <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 18, fontSize: 15 }}>
            Essayez de modifier votre recherche ou vos filtres
          </Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#FF7F00', borderRadius: 16, paddingVertical: 10, paddingHorizontal: 24 }}
            onPress={resetFilters}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Réinitialiser les filtres</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Filter Modal */}
      <Modal
        visible={isFilterOpen}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderColor: '#E5E7EB' }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Filtres</Text>
            <TouchableOpacity onPress={() => setIsFilterOpen(false)}>
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
          </View>
          <ScrollView style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 16 }}>
            {/* Category Filter */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Catégorie</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity
                    style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: filters.category === '' ? '#FF7F00' : '#D1D5DB', backgroundColor: filters.category === '' ? '#FF7F00' : '#fff', marginRight: 8 }}
                    onPress={() => setFilters(prev => ({ ...prev, category: '' }))}
                  >
                    <Text style={{ color: filters.category === '' ? '#fff' : '#374151', fontWeight: '500' }}>
                      Toutes
                    </Text>
                  </TouchableOpacity>
                  {CATEGORIES.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: filters.category === category.id ? '#FF7F00' : '#D1D5DB', backgroundColor: filters.category === category.id ? '#FF7F00' : '#fff', marginRight: 8 }}
                      onPress={() => setFilters(prev => ({ ...prev, category: category.id }))}
                    >
                      <Text style={{ color: filters.category === category.id ? '#fff' : '#374151', fontWeight: '500' }}>
                        {category.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* Condition Filter */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>État</Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                <TouchableOpacity
                  style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: filters.condition === '' ? '#FF7F00' : '#D1D5DB', backgroundColor: filters.condition === '' ? '#FF7F00' : '#fff', marginRight: 8, marginBottom: 8 }}
                  onPress={() => setFilters(prev => ({ ...prev, condition: '' }))}
                >
                  <Text style={{ color: filters.condition === '' ? '#fff' : '#374151', fontWeight: '500' }}>
                    Tous
                  </Text>
                </TouchableOpacity>
                {CONDITIONS.map((condition) => (
                  <TouchableOpacity
                    key={condition.id}
                    style={{ paddingHorizontal: 16, paddingVertical: 8, borderRadius: 999, borderWidth: 1, borderColor: filters.condition === condition.id ? '#FF7F00' : '#D1D5DB', backgroundColor: filters.condition === condition.id ? '#FF7F00' : '#fff', marginRight: 8, marginBottom: 8 }}
                    onPress={() => setFilters(prev => ({ ...prev, condition: condition.id }))}
                  >
                    <Text style={{ color: filters.condition === condition.id ? '#fff' : '#374151', fontWeight: '500' }}>
                      {condition.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Price Range */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 16, fontWeight: '600', marginBottom: 8 }}>Prix (FCFA)</Text>
              <View style={{ flexDirection: 'row' }}>
                <TextInput
                  style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8, marginRight: 8 }}
                  placeholder="Prix min"
                  value={filters.minPrice}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, minPrice: text }))}
                  keyboardType="numeric"
                />
                <TextInput
                  style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 8 }}
                  placeholder="Prix max"
                  value={filters.maxPrice}
                  onChangeText={(text) => setFilters(prev => ({ ...prev, maxPrice: text }))}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </ScrollView>
          {/* Filter Actions */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12, borderTopWidth: 1, borderColor: '#E5E7EB' }}>
            <View style={{ flexDirection: 'row' }}>
              <TouchableOpacity
                style={{ flex: 1, borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 12, paddingVertical: 10, alignItems: 'center', marginRight: 8 }}
                onPress={resetFilters}
              >
                <Text style={{ color: '#374151', fontWeight: '600' }}>Réinitialiser</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ flex: 1, backgroundColor: '#FF7F00', borderRadius: 12, paddingVertical: 10, alignItems: 'center' }}
                onPress={applyFilters}
              >
                <Text style={{ color: '#fff', fontWeight: '600' }}>Appliquer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}