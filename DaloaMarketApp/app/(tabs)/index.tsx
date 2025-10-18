import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  FlatList,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ListingCard from '../../components/listings/ListingCard';
import { CATEGORIES } from '../../lib/utils';
import { Database } from '../../lib/database.types';
import Toast from 'react-native-toast-message';

type Listing = Database['public']['Tables']['listings']['Row'];
type ListingWithSeller = Listing & { seller_name: string; seller_rating: number | null };

export default function HomeScreen() {
  const { user, userProfile } = useAuth();
  const [latestListings, setLatestListings] = useState<ListingWithSeller[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLatestListings();
  }, []);

  const fetchLatestListings = async () => {
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
        .limit(10);

      if (error) throw error;

      const formattedListings = data.map(item => ({
        ...item,
        seller_name: item.users?.full_name || 'Utilisateur',
        seller_rating: item.users?.rating || null
      }));

      setLatestListings(formattedListings);
    } catch (error) {
      console.error('Error fetching listings:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les annonces'
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchLatestListings();
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleCategoryPress = (categoryId: string) => {
    router.push(`/search?category=${categoryId}`);
  };

  const handleListingPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header visuel */}
      <View style={{ backgroundColor: '#fff', paddingTop: 32, paddingBottom: 18, paddingHorizontal: 20, borderBottomWidth: 0, borderColor: '#F3F4F6', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#FF7F00', marginBottom: 2, letterSpacing: 0.5 }}>DaloaMarket</Text>
        <Text style={{ fontSize: 16, color: '#6B7280', marginBottom: 10 }}>Achetez et vendez à Daloa</Text>
        {/* Barre de recherche */}
        <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8, shadowColor: '#000', shadowOpacity: 0.03, shadowRadius: 4, elevation: 1, width: '100%' }}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={{ marginRight: 8 }} />
          <TextInput
            style={{ flex: 1, fontSize: 16, color: '#111827', paddingVertical: 0, backgroundColor: 'transparent' }}
            placeholder="Rechercher un produit..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity onPress={handleSearch} style={{ marginLeft: 6, backgroundColor: '#FF7F00', borderRadius: 12, padding: 8 }}>
            <Ionicons name="arrow-forward-circle" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Alert */}
      {user && userProfile && (!userProfile.full_name || !userProfile.phone || !userProfile.district) && (
        <View style={{ backgroundColor: '#FEF3C7', borderLeftWidth: 4, borderLeftColor: '#F59E42', padding: 14, marginHorizontal: 20, marginTop: 18, borderRadius: 12 }}>
          <Text style={{ color: '#B45309', fontWeight: 'bold', marginBottom: 6 }}>Profil incomplet</Text>
          <TouchableOpacity 
            style={{ backgroundColor: '#F59E42', borderRadius: 8, paddingVertical: 8, paddingHorizontal: 18, alignSelf: 'flex-start' }}
            onPress={() => router.push('/auth/complete-profile')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold' }}>Compléter mon profil</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Categories */}
      <View style={{ paddingHorizontal: 20, paddingVertical: 22 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937', marginBottom: 14 }}>
          Explorez par catégorie
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: 'row', gap: 14 }}>
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2, minWidth: 110, alignItems: 'center', marginRight: 10, borderWidth: 1, borderColor: '#F3F4F6' }}
                onPress={() => handleCategoryPress(category.id)}
                activeOpacity={0.8}
              >
                <View style={{ backgroundColor: '#FFF7ED', borderRadius: 14, padding: 10, marginBottom: 10 }}>
                  <Ionicons name="storefront" size={24} color="#FF7F00" />
                </View>
                <Text style={{ fontWeight: 'bold', color: '#1F2937', textAlign: 'center', fontSize: 14 }}>
                  {category.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Latest Listings */}
      <View style={{ paddingHorizontal: 20, paddingBottom: 24 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#1F2937' }}>
            Dernières annonces
          </Text>
          <TouchableOpacity onPress={() => router.push('/search')}>
            <Text style={{ color: '#FF7F00', fontWeight: 'bold' }}>Voir tout</Text>
          </TouchableOpacity>
        </View>

        {latestListings.length > 0 ? (
          <FlatList
            data={latestListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
                <ListingCard
                  listing={item}
                  onPress={() => handleListingPress(item.id)}
                  sellerName={item.seller_name}
                  sellerRating={item.seller_rating}
                />
              </View>
            )}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={{ backgroundColor: '#fff', borderRadius: 24, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 3, padding: 32, alignItems: 'center' }}>
            <Ionicons name="storefront-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#1F2937' }}>Aucune annonce</Text>
            <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 18, fontSize: 15 }}>
              Soyez le premier à publier une annonce !
            </Text>
            <TouchableOpacity 
              style={{ backgroundColor: '#FF7F00', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 28 }}
              onPress={() => router.push('/create')}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Publier une annonce</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
}