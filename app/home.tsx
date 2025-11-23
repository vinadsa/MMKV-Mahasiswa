import { addMahasiswa, getAllMahasiswa } from '@/src/services/firebaseService';
import { AuthContext } from '@/src/storage/AuthContext';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function HomeScreen() {
  const router = useRouter();
  const { user, logout } = useContext(AuthContext);
  const [mahasiswaList, setMahasiswaList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Fetch data mahasiswa
    fetchMahasiswa();
  }, []);

  const fetchMahasiswa = async () => {
    setLoading(true);
    const result = await getAllMahasiswa();
    setLoading(false);

    if (result.success) {
      setMahasiswaList(result.data || []);
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMahasiswa();
    setRefreshing(false);
  };

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Apakah Anda yakin ingin keluar?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('login' as any);
          },
        },
      ]
    );
  };

  const handleAddSampleData = async () => {
    const sampleData = {
      nim: '24060122' + Math.floor(Math.random() * 10000),
      nama: 'Mahasiswa ' + Math.floor(Math.random() * 100),
      jurusan: 'Informatika',
      angkatan: 2022,
      email: 'mhs' + Math.floor(Math.random() * 1000) + '@students.undip.ac.id',
    };

    const result = await addMahasiswa(sampleData);
    if (result.success) {
      Alert.alert('Sukses', 'Data mahasiswa berhasil ditambahkan!');
      fetchMahasiswa();
    } else {
      Alert.alert('Error', result.error);
    }
  };

  const renderMahasiswa = ({ item }: any) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.nama}>{item.nama}</Text>
        <Text style={styles.nim}>{item.nim}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.info}>📚 {item.jurusan}</Text>
        <Text style={styles.info}>🎓 Angkatan {item.angkatan}</Text>
        <Text style={styles.info}>✉️ {item.email}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Memuat data...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Data Mahasiswa</Text>
          <Text style={styles.headerSubtitle}>
            {user?.email || 'User'}
          </Text>
        </View>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{mahasiswaList.length}</Text>
          <Text style={styles.statLabel}>Total Mahasiswa</Text>
        </View>
      </View>

      <FlatList
        data={mahasiswaList}
        renderItem={renderMahasiswa}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>📝 Belum ada data mahasiswa</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddSampleData}
            >
              <Text style={styles.addButtonText}>+ Tambah Data Sample</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {mahasiswaList.length > 0 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={handleAddSampleData}
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#007AFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  logoutButton: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
  statsContainer: {
    padding: 20,
  },
  statCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#007AFF',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  listContainer: {
    padding: 20,
    paddingTop: 0,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  nama: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  nim: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  cardBody: {
    gap: 6,
  },
  info: {
    fontSize: 14,
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  floatingButtonText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '300',
  },
});
