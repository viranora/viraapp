import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Stack, router, useSegments } from 'expo-router'; // useSegments'i import ettik
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { token, loading } = useAuth(); // AuthContext'ten 'loading' durumunu da alıyoruz
  const segments = useSegments(); // Kullanıcının şu an hangi ekranda/grupta olduğunu alır

  useEffect(() => {
    // Eğer AuthContext hala verileri yüklüyorsa, hiçbir şey yapma
    if (loading) {
      return;
    }

    const inAuthGroup = segments[0] === '(auth)';

    // Eğer token yoksa (kullanıcı giriş yapmamışsa)
    if (!token && !inAuthGroup) {
      // VE kullanıcı zaten auth grubunda DEĞİLSE, onu auth grubuna yönlendir.
      router.replace('/(auth)');
    } 
    // Eğer token varsa (kullanıcı giriş yapmışsa)
    else if (token && inAuthGroup) {
      // VE kullanıcı hala auth grubundaysa (örn: giriş yaptıktan sonra), onu ana sekmelere yönlendir.
      router.replace('/(tabs)/vira');
    }

    SplashScreen.hideAsync();

  }, [token, loading, segments]); // Bu effect artık token, loading veya segment değiştiğinde çalışacak

  // Yükleme sırasında hiçbir şey göstermiyoruz, bu sayede titremeyi önlüyoruz
  if (loading) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="profile" options={{ presentation: 'modal', headerShown: true, title: 'Profilim' }} />
      <Stack.Screen name="settings" options={{ presentation: 'modal', headerShown: true, title: 'Ayarlar' }} />
      <Stack.Screen name="journal" options={{ presentation: 'modal', headerShown: true, title: 'Günlük' }} />
      <Stack.Screen name="motivation" options={{ presentation: 'modal', headerShown: true, title: 'Motivasyon Kartları' }} />
    </Stack>
  );
}

// AuthContext'i de güncellememiz gerekiyor ki 'loading' durumunu dışarıya versin.
// Lütfen context/AuthContext.tsx dosyanı da aşağıdakiyle değiştir.

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}