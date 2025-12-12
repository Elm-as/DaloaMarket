import React, { useEffect, useState } from 'react';
import { useSupabase } from '../../hooks/useSupabase';
import { Navigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

type CreditRow = {
  user_id: string;
  credits: number;
  total_earned: number;
  total_spent: number;
};

type TransactionRow = {
  id: string;
  user_id: string;
  amount: number;
  type: string;
  status: string;
  created_at: string;
};

type ListingRow = {
  id: string;
  title: string;
  user_id: string;
  price: number;
  status: string;
  created_at: string;
};

type UserRow = {
  id: string;
  email: string;
  full_name: string;
  role: string;
  banned: boolean;
  credits: number;
};

const AdminDashboardPage: React.FC = () => {
  // Utilisateurs (doit être déclaré avant pendingEdits)
  const [users, setUsers] = useState<UserRow[]>([]);
  // État local pour les modifications par utilisateur (crédits et rôle)
  const [pendingEdits, setPendingEdits] = useState<Record<string, { credits: number; role: string }>>({});
  // Feedback visuel par utilisateur
  const [saveStatus, setSaveStatus] = useState<Record<string, { success?: boolean; error?: string }>>({});
  // Synchroniser l'état local avec les utilisateurs chargés
  useEffect(() => {
    if (users.length > 0) {
      setPendingEdits(
        users.reduce((acc, user) => {
          acc[user.id] = { credits: user.credits, role: user.role };
          return acc;
        }, {} as Record<string, { credits: number; role: string }>));
    }
  }, [users]);
  const { userProfile } = useSupabase();

  // Debug Supabase client (affiché une seule fois au montage)
  useEffect(() => {
    console.log('DEBUG SUPABASE:', supabase);
  }, []);
  // Utilisateurs
  // (supprimé doublon users/setUsers)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Annonces
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);
  const [errorListings, setErrorListings] = useState<string | null>(null);

  // Crédits
  const [credits, setCredits] = useState<CreditRow[]>([]);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [errorCredits, setErrorCredits] = useState<string | null>(null);

  // Transactions
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [errorTransactions, setErrorTransactions] = useState<string | null>(null);

  // Récupérer les utilisateurs
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error }: any = await supabase
          .from('users')
          .select('id, email, full_name, role, banned, user_credits(credits)');
        if (error) throw error;
        const users: UserRow[] = (data || []).map((u: any) => ({
          id: u.id,
          email: u.email,
          full_name: u.full_name,
          role: u.role,
          banned: u.banned,
          credits: u.user_credits?.credits ?? 0,
        }));
        setUsers(users);
      } catch (e) {
        setError((e as { message?: string }).message || 'Erreur lors du chargement des utilisateurs');
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [userProfile]);

  // Récupérer les annonces
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;
    const fetchListings = async () => {
      setLoadingListings(true);
      setErrorListings(null);
      try {
        const { data, error }: any = await supabase
          .from('listings')
          .select('id, title, user_id, price, status, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setListings(data || []);
      } catch (e) {
        setErrorListings((e as { message?: string }).message || 'Erreur lors du chargement des annonces');
      } finally {
        setLoadingListings(false);
      }
    };
    fetchListings();
  }, [userProfile]);

  // Récupérer les crédits
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;
    const fetchCredits = async () => {
      setLoadingCredits(true);
      setErrorCredits(null);
      try {
        const { data, error }: any = await supabase
          .from('user_credits')
          .select('user_id, credits, total_earned, total_spent');
        if (error) throw error;
        setCredits(data || []);
      } catch (e) {
        setErrorCredits((e as { message?: string }).message || 'Erreur lors du chargement des crédits');
      } finally {
        setLoadingCredits(false);
      }
    };
    fetchCredits();
  }, [userProfile]);

  // Récupérer les transactions
  useEffect(() => {
    if (!userProfile || userProfile.role !== 'admin') return;
    const fetchTransactions = async () => {
      setLoadingTransactions(true);
      setErrorTransactions(null);
      try {
        const { data, error }: any = await supabase
          .from('transactions')
          .select('id, user_id, amount, type, status, created_at')
          .order('created_at', { ascending: false });
        if (error) throw error;
        setTransactions(data || []);
      } catch (e) {
        setErrorTransactions((e as { message?: string }).message || 'Erreur lors du chargement des transactions');
      } finally {
        setLoadingTransactions(false);
      }
    };
    fetchTransactions();
  }, [userProfile]);

  // Action bannir/débannir
  const toggleBan = async (userId: string, banned: boolean) => {
    await supabase.from('users').update({ banned: !banned }).eq('id', userId);
    setUsers(users => users.map(u => u.id === userId ? { ...u, banned: !banned } : u));
  };

  // Action crédit (ajout/soustraction)
  const updateCredits = async (userId: string, newCredits: number) => {
    await (supabase as any).from('user_credits').update({ credits: newCredits }).eq('user_id', userId);
    setUsers(users => users.map(u => u.id === userId ? { ...u, credits: newCredits } : u));
  };

  // Action changer le rôle
  const updateRole = async (userId: string, newRole: string) => {
    await supabase.from('users').update({ role: newRole }).eq('id', userId);
    setUsers(users => users.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  // Action supprimer une annonce
  const deleteListing = async (listingId: string) => {
    if (!window.confirm('Supprimer cette annonce ?')) return;
    await supabase.from('listings').delete().eq('id', listingId);
    setListings(listings => listings.filter(l => l.id !== listingId));
  };

  // Action désactiver une annonce
  const disableListing = async (listingId: string) => {
    await supabase.from('listings').update({ status: 'disabled' }).eq('id', listingId);
    setListings(listings => listings.map(l => l.id === listingId ? { ...l, status: 'disabled' } : l));
  };

  // Action marquer comme vendue
  const markAsSold = async (listingId: string) => {
    await supabase.from('listings').update({ status: 'sold' }).eq('id', listingId);
    setListings(listings => listings.map(l => l.id === listingId ? { ...l, status: 'sold' } : l));
  };

  if (!userProfile || userProfile.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-grey-50 py-10">
      <div className="container-custom max-w-5xl bg-white rounded-card shadow-card p-8">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord Admin</h1>
        <p className="mb-4 text-grey-700">Gérez les utilisateurs, bannissements et crédits.</p>
        {error && <div className="text-error-600 mb-4">{error}</div>}
        {loading ? (
          <div>Chargement...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-grey-100">
                  <th className="p-2">ID (court)</th>
                  <th className="p-2">Email</th>
                  <th className="p-2">Nom</th>
                  <th className="p-2">Rôle</th>
                  <th className="p-2">Banni</th>
                  <th className="p-2">Crédits</th>
                  <th className="p-2">Ajouter un pack</th>
                  <th className="p-2">Actions</th>
                  <th className="p-2">Sauvegarder</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => {
                  const shortId = user.id.slice(0, 6) + '...' + user.id.slice(-4);
                  const packs = [
                    { label: '+3 crédits (500 FCFA)', value: 3, price: 500 },
                    { label: '+10 crédits (1500 FCFA)', value: 10, price: 1500 },
                    { label: '+30 crédits (3500 FCFA)', value: 30, price: 3500 },
                  ];
                  const pending = pendingEdits[user.id] || { credits: user.credits, role: user.role };
                  const handleAddPack = (packValue: number) => {
                    setPendingEdits(edits => ({
                      ...edits,
                      [user.id]: {
                        ...pending,
                        credits: pending.credits + packValue,
                      },
                    }));
                  };
                  const handleRoleChange = (role: string) => {
                    setPendingEdits(edits => ({
                      ...edits,
                      [user.id]: {
                        ...pending,
                        role,
                      },
                    }));
                  };
                  const handleSave = async () => {
                    setSaveStatus(status => ({ ...status, [user.id]: { success: undefined, error: undefined } }));
                    try {
                      await updateCredits(user.id, pending.credits);
                      await updateRole(user.id, pending.role);
                      // Recharge les utilisateurs pour refléter la base réelle
                      setLoading(true);
                      setError(null);
                      const { data, error }: any = await supabase
                        .from('users')
                        .select('id, email, full_name, role, banned, user_credits(credits)');
                      if (error) throw error;
                      const users: UserRow[] = (data || []).map((u: any) => ({
                        id: u.id,
                        email: u.email,
                        full_name: u.full_name,
                        role: u.role,
                        banned: u.banned,
                        credits: u.user_credits?.credits ?? 0,
                      }));
                      setUsers(users);
                      setSaveStatus(status => ({ ...status, [user.id]: { success: true } }));
                    } catch (e) {
                      setError((e as { message?: string }).message || 'Erreur lors du rechargement');
                      setSaveStatus(status => ({ ...status, [user.id]: { error: (e as { message?: string }).message || 'Erreur lors de la sauvegarde' } }));
                    } finally {
                      setLoading(false);
                      // Efface le message après 2,5s
                      setTimeout(() => {
                        setSaveStatus(status => ({ ...status, [user.id]: {} }));
                      }, 2500);
                    }
                  };
                  return (
                    <tr key={user.id} className="border-b">
                      <td className="p-2 font-mono text-xs">{shortId}</td>
                      <td className="p-2">{user.email}</td>
                      <td className="p-2">{user.full_name}</td>
                      <td className="p-2">
                        <select
                          className="px-2 py-1 rounded border bg-white text-grey-800"
                          value={pending.role}
                          onChange={e => handleRoleChange(e.target.value)}
                          aria-label="Changer le rôle"
                        >
                          <option value="user">Utilisateur</option>
                          <option value="moderator">Modérateur</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="p-2">{user.banned ? 'Oui' : 'Non'}</td>
                      <td className="p-2">{pending.credits}</td>
                      <td className="p-2 flex flex-col gap-1">
                        {packs.map(pack => (
                          <button
                            key={pack.value}
                            className="px-2 py-1 rounded bg-blue-100 text-blue-800 border border-blue-300 hover:bg-blue-200"
                            onClick={() => handleAddPack(pack.value)}
                          >
                            {pack.label}
                          </button>
                        ))}
                      </td>
                      <td className="p-2 flex gap-2 flex-wrap">
                        <button
                          className={`px-2 py-1 rounded ${user.banned ? 'bg-green-500' : 'bg-red-500'} text-white`}
                          onClick={() => toggleBan(user.id, user.banned)}
                        >
                          {user.banned ? 'Débannir' : 'Bannir'}
                        </button>
                      </td>
                      <td className="p-2">
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            className="px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700"
                            onClick={handleSave}
                          >
                            Sauvegarder
                          </button>
                          {saveStatus[user.id]?.success && (
                            <span className="text-green-600 text-xs">Modifications enregistrées !</span>
                          )}
                          {saveStatus[user.id]?.error && (
                            <span className="text-red-600 text-xs">{saveStatus[user.id].error}</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {/* Gestion des annonces */}
      <div className="container-custom max-w-5xl bg-white rounded-card shadow-card p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">Gestion des annonces</h2>
        {errorListings && <div className="text-error-600 mb-4">{errorListings}</div>}
        {loadingListings ? (
          <div>Chargement des annonces...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-grey-100">
                  <th className="p-2">Titre</th>
                  <th className="p-2">ID utilisateur</th>
                  <th className="p-2">Prix</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2">Créée le</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {listings.map(listing => (
                  <tr key={listing.id} className="border-b">
                    <td className="p-2">{listing.title}</td>
                    <td className="p-2">{listing.user_id}</td>
                    <td className="p-2">{listing.price} FCFA</td>
                    <td className="p-2">{listing.status}</td>
                    <td className="p-2">{new Date(listing.created_at).toLocaleString()}</td>
                    <td className="p-2 flex gap-2 flex-wrap">
                      <button
                        className="px-2 py-1 rounded bg-red-500 text-white"
                        onClick={() => deleteListing(listing.id)}
                      >
                        Supprimer
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-yellow-500 text-white"
                        onClick={() => disableListing(listing.id)}
                        disabled={listing.status === 'disabled'}
                      >
                        Désactiver
                      </button>
                      <button
                        className="px-2 py-1 rounded bg-green-600 text-white"
                        onClick={() => markAsSold(listing.id)}
                        disabled={listing.status === 'sold'}
                      >
                        Marquer comme vendue
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gestion des crédits utilisateurs */}
      <div className="container-custom max-w-5xl bg-white rounded-card shadow-card p-8 mt-8">
        <h2 className="text-2xl font-bold mb-4">Crédits & Gains utilisateurs</h2>
        {errorCredits && <div className="text-error-600 mb-4">{errorCredits}</div>}
        {loadingCredits ? (
          <div>Chargement des crédits...</div>
        ) : (
          <div className="overflow-x-auto mb-8">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-grey-100">
                  <th className="p-2">ID utilisateur</th>
                  <th className="p-2">Crédits</th>
                  <th className="p-2">Total gagné</th>
                  <th className="p-2">Total dépensé</th>
                </tr>
              </thead>
              <tbody>
                {credits.map(c => (
                  <tr key={c.user_id} className="border-b">
                    <td className="p-2">{c.user_id}</td>
                    <td className="p-2">{c.credits}</td>
                    <td className="p-2">{c.total_earned} FCFA</td>
                    <td className="p-2">{c.total_spent} FCFA</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <h3 className="text-xl font-bold mb-2 mt-8">Historique des transactions</h3>
        {errorTransactions && <div className="text-error-600 mb-4">{errorTransactions}</div>}
        {loadingTransactions ? (
          <div>Chargement des transactions...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border text-sm">
              <thead>
                <tr className="bg-grey-100">
                  <th className="p-2">ID</th>
                  <th className="p-2">Utilisateur</th>
                  <th className="p-2">Montant</th>
                  <th className="p-2">Type</th>
                  <th className="p-2">Statut</th>
                  <th className="p-2">Date</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(t => (
                  <tr key={t.id} className="border-b">
                    <td className="p-2">{t.id}</td>
                    <td className="p-2">{t.user_id}</td>
                    <td className="p-2">{t.amount} FCFA</td>
                    <td className="p-2">{t.type}</td>
                    <td className="p-2">{t.status}</td>
                    <td className="p-2">{new Date(t.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
