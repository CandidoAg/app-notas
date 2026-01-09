import { Stack } from 'expo-router';
import { ThemeProvider } from '../context/ThemeContext';

export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="notes/index" />
        <Stack.Screen name="notes/details" />
      </Stack>
    </ThemeProvider>
  );
}