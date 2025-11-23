// src/services/firebaseService.ts
import {
    createUserWithEmailAndPassword,
    User as FirebaseUser,
    signInWithEmailAndPassword,
    signOut
} from 'firebase/auth';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    onSnapshot,
    orderBy,
    query,
    serverTimestamp,
    Timestamp,
    updateDoc
} from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import { clearCredentials, saveCredentials } from '../storage/mmkvCredentials';
import { clearUser, saveUser, StoredUser } from '../storage/mmkvUser';

// ============ AUTHENTICATION ============

// Register user baru
export const registerUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user: FirebaseUser = userCredential.user;
    
    const userData: StoredUser = {
      uid: user.uid,
      email: user.email,
    };
    
    // Simpan ke MMKV
    saveUser(userData);
    saveCredentials({ email, password });
    
    console.log('✅ User berhasil register:', user.email);
    return { success: true, user: userData };
  } catch (error: any) {
    console.error('❌ Error register:', error.message);
    return { success: false, error: error.message };
  }
};

// Login user
export const loginUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user: FirebaseUser = userCredential.user;
    
    const userData: StoredUser = {
      uid: user.uid,
      email: user.email,
    };
    
    // Simpan ke MMKV
    saveUser(userData);
    saveCredentials({ email, password });
    
    console.log('✅ User berhasil login:', user.email);
    return { success: true, user: userData };
  } catch (error: any) {
    console.error('❌ Error login:', error.message);
    return { success: false, error: error.message };
  }
};

// Logout user
export const logoutUser = async () => {
  try {
    await signOut(auth);
    clearUser();
    clearCredentials();
    console.log('✅ User berhasil logout');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error logout:', error.message);
    return { success: false, error: error.message };
  }
};

// Get current user
export const getCurrentUser = () => {
  return auth.currentUser;
};

// ============ FIRESTORE OPERATIONS ============

export interface MahasiswaData {
  nim: string;
  nama: string;
  jurusan: string;
  angkatan: number;
  email: string;
}

export interface MahasiswaDoc extends MahasiswaData {
  id: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

// Tambah data mahasiswa
export const addMahasiswa = async (data: MahasiswaData) => {
  try {
    const docRef = await addDoc(collection(db, 'mahasiswa'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    console.log('✅ Mahasiswa ditambahkan dengan ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error: any) {
    console.error('❌ Error menambah mahasiswa:', error);
    return { success: false, error: error.message };
  }
};

// Fetch semua data mahasiswa
export const getAllMahasiswa = async () => {
  try {
    const q = query(collection(db, 'mahasiswa'), orderBy('nim', 'asc'));
    const snapshot = await getDocs(q);
    
    const mahasiswaList: MahasiswaDoc[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    } as MahasiswaDoc));
    
    console.log(`✅ Berhasil fetch ${mahasiswaList.length} data mahasiswa`);
    return { success: true, data: mahasiswaList };
  } catch (error: any) {
    console.error('❌ Error fetch mahasiswa:', error);
    return { success: false, error: error.message };
  }
};

// Fetch mahasiswa berdasarkan ID
export const getMahasiswaById = async (id: string) => {
  try {
    const docRef = doc(db, 'mahasiswa', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } as MahasiswaDoc };
    } else {
      return { success: false, error: 'Mahasiswa tidak ditemukan' };
    }
  } catch (error: any) {
    console.error('❌ Error fetch mahasiswa by ID:', error);
    return { success: false, error: error.message };
  }
};

// Update data mahasiswa
export const updateMahasiswa = async (id: string, data: Partial<MahasiswaData>) => {
  try {
    const docRef = doc(db, 'mahasiswa', id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
    console.log('✅ Mahasiswa berhasil diupdate');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error update mahasiswa:', error);
    return { success: false, error: error.message };
  }
};

// Delete mahasiswa
export const deleteMahasiswa = async (id: string) => {
  try {
    const docRef = doc(db, 'mahasiswa', id);
    await deleteDoc(docRef);
    console.log('✅ Mahasiswa berhasil dihapus');
    return { success: true };
  } catch (error: any) {
    console.error('❌ Error delete mahasiswa:', error);
    return { success: false, error: error.message };
  }
};

// Real-time listener untuk mahasiswa
export const subscribeMahasiswaUpdates = (callback: (data: MahasiswaDoc[]) => void) => {
  const q = query(collection(db, 'mahasiswa'), orderBy('nim', 'asc'));
  
  return onSnapshot(
    q,
    (snapshot) => {
      const mahasiswaList: MahasiswaDoc[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as MahasiswaDoc));
      callback(mahasiswaList);
    },
    (error) => {
      console.error('❌ Error realtime listener:', error);
    }
  );
};