import { getStoredUser } from '@/src/storage/mmkvUser';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = getStoredUser();
    const targetRoute = storedUser && storedUser.uid ? 'home' : 'login';

    const id = setTimeout(() => {
      router.replace(targetRoute as any);
    }, 0);

    return () => clearTimeout(id);
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="#007AFF" />
    </View>
  );
}
