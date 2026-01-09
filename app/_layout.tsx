import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { useRouter, useSegments } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const inAuthGroup = segments[0] === 'notas';

      if (!user && inAuthGroup) {
        router.replace('/');
      } else if (user && !inAuthGroup) {
        router.replace('/notas');
      }
    });

    return unsubscribe;
  }, [segments]);

  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="notas/index" />
        <Stack.Screen name="notas/details" />
      </Stack>
    </ThemeProvider>
  );
}