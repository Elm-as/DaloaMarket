import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ListingCard from '../../components/listings/ListingCard';
import { formatPhoneNumber, formatDate } from '../../lib/utils';
import { Database } from '../../lib/database.types';
import Toast from 'react-native-toast-message';

type Listing = Database['public']['Tables']['listings']['Row'];

export default function ProfileScreen() {
  const { user, userProfile, signOut } = useAuth();
  const [userListings, setUserListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'listings' | 'reviews'>('listings');

  useEffect(() => {
    if (!user) return;
    
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    
    try {
      const { data: listings, error: listingsError } = await supabase
        .from('listings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (listingsError) throw listingsError;
      
      setUserListings(listings || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Erreur',
        text2: 'Impossible de charger les données'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { 
          text: 'Déconnexion', 
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              Toast.show({
                type: 'success',
                text1: 'Déconnexion réussie'
              });
            } catch (error) {
              Toast.show({
                type: 'error',
                text1: 'Erreur lors de la déconnexion'
              });
            }
          }
        },
      ]
    );
  };

  const handleListingPress = (listingId: string) => {
    router.push(`/listing/${listingId}`);
  };

  const renderListingItem = ({ item }: { item: Listing }) => (
    <ListingCard
      listing={item}
      onPress={() => handleListingPress(item.id)}
    />
  );

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-grey-50 px-6">
        <Ionicons name="person-outline\" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold mt-4 mb-2">Connexion requise</Text>
        <Text className="text-grey-600 text-center mb-6">
          Connectez-vous pour accéder à votre profil
        </Text>
        <TouchableOpacity 
          className="bg-primary rounded-2xl py-3 px-6"
          onPress={() => router.push('/auth/login')}
        >
          <Text className="text-white font-semibold">Se connecter</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!userProfile) {
    return (
      <View className="flex-1 justify-center items-center bg-grey-50 px-6">
        <Ionicons name="person-add-outline" size={64} color="#9CA3AF" />
        <Text className="text-xl font-bold mt-4 mb-2">Profil incomplet</Text>
        <Text className="text-grey-600 text-center mb-6">
          Complétez votre profil pour accéder à toutes les fonctionnalités
        </Text>
        <TouchableOpacity 
          className="bg-primary rounded-2xl py-3 px-6"
          onPress={() => router.push('/auth/complete-profile')}
        >
          <Text className="text-white font-semibold">Compléter mon profil</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header visuel profil */}
      <View style={{ backgroundColor: '#fff', paddingTop: 32, paddingBottom: 18, paddingHorizontal: 20, borderBottomWidth: 0, borderColor: '#F3F4F6', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <View style={{ backgroundColor: '#FFF7ED', borderRadius: 60, padding: 18, marginBottom: 12 }}>
          <Ionicons name="person" size={48} color="#FF7F00" />
        </View>
        <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#1F2937', marginBottom: 2 }}>{userProfile.full_name}</Text>
        <Text style={{ color: '#6B7280', marginBottom: 6 }}>{user.email}</Text>
        {userProfile.rating && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
            <Ionicons name="star" size={20} color="#FF7F00" />
            <Text style={{ marginLeft: 4, fontWeight: 'bold', color: '#FF7F00' }}>{userProfile.rating.toFixed(1)}</Text>
          </View>
        )}
        <Text style={{ color: '#9CA3AF', fontSize: 13 }}>Membre depuis {formatDate(userProfile.created_at)}</Text>
      </View>

      {/* Infos profil en cartes */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 18, marginBottom: 10 }}>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, minWidth: 120 }}>
          <Ionicons name="call" size={20} color="#FF7F00" />
          <Text style={{ marginLeft: 10, color: '#1F2937', fontWeight: '500' }}>{formatPhoneNumber(userProfile.phone)}</Text>
        </View>
        <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 6, elevation: 1, minWidth: 120 }}>
          <Ionicons name="location" size={20} color="#FF7F00" />
          <Text style={{ marginLeft: 10, color: '#1F2937', fontWeight: '500' }}>{userProfile.district}</Text>
        </View>
      </View>

      {/* Boutons d'action modernes */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 14, marginBottom: 18 }}>
        <TouchableOpacity 
          style={{ backgroundColor: '#FF7F00', borderRadius: 12, paddingVertical: 12, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}
          onPress={() => router.push('/auth/settings')}
        >
          <Ionicons name="settings" size={20} color="#fff" />
          <Text style={{ color: '#fff', fontWeight: 'bold', marginLeft: 8 }}>Modifier le profil</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={{ borderColor: '#FCA5A5', borderWidth: 1, borderRadius: 12, paddingVertical: 12, paddingHorizontal: 22, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff' }}
          onPress={handleSignOut}
        >
          <Ionicons name="log-out" size={20} color="#DC2626" />
          <Text style={{ color: '#DC2626', fontWeight: 'bold', marginLeft: 8 }}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={{ backgroundColor: '#fff', borderBottomWidth: 1, borderColor: '#F3F4F6', marginBottom: 0 }}>
        <View style={{ flexDirection: 'row' }}>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: activeTab === 'listings' ? '#FF7F00' : 'transparent' }}
            onPress={() => setActiveTab('listings')}
          >
            <Text style={{ fontWeight: 'bold', color: activeTab === 'listings' ? '#FF7F00' : '#6B7280', fontSize: 16 }}>
              Mes annonces
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ flex: 1, paddingVertical: 16, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: activeTab === 'reviews' ? '#FF7F00' : 'transparent' }}
            onPress={() => setActiveTab('reviews')}
          >
            <Text style={{ fontWeight: 'bold', color: activeTab === 'reviews' ? '#FF7F00' : '#6B7280', fontSize: 16 }}>
              Avis reçus
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tab Content */}
      <View style={{ padding: 20 }}>
        {activeTab === 'listings' && (
          userListings.length > 0 ? (
            <FlatList
              data={userListings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ backgroundColor: '#fff', borderRadius: 18, padding: 16, marginBottom: 14, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 }}>
                  <ListingCard
                    listing={item}
                    onPress={() => handleListingPress(item.id)}
                  />
                </View>
              )}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={{ alignItems: 'center', paddingVertical: 48 }}>
              <Ionicons name="storefront-outline" size={64} color="#9CA3AF" />
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#1F2937' }}>Aucune annonce</Text>
              <Text style={{ color: '#6B7280', textAlign: 'center', marginBottom: 18, fontSize: 15 }}>
                Vous n'avez pas encore publié d'annonces
              </Text>
              <TouchableOpacity 
                style={{ backgroundColor: '#FF7F00', borderRadius: 16, paddingVertical: 12, paddingHorizontal: 28 }}
                onPress={() => router.push('/create')}
              >
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 15 }}>Publier une annonce</Text>
              </TouchableOpacity>
            </View>
          )
        )}

        {activeTab === 'reviews' && (
          <View style={{ alignItems: 'center', paddingVertical: 48 }}>
            <Ionicons name="star-outline" size={64} color="#9CA3AF" />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#1F2937' }}>Aucun avis</Text>
            <Text style={{ color: '#6B7280', textAlign: 'center', fontSize: 15 }}>
              Vous n'avez pas encore reçu d'avis
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}