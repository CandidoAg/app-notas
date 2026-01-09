import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebaseConfig';
import { useTheme } from '../context/ThemeContext';
import { useRouter } from 'expo-router';

export const LogoutButton = ({ variant = 'icon' }: { variant?: 'icon' | 'full' }) => {
  const { theme } = useTheme();
  const router = useRouter();

  const performLogout = async () => {
    try {
      console.log("Cerrando sesión...");
      await signOut(auth);
      if (router.canGoBack()) router.dismissAll();
      router.replace('/');
    } catch (error) {
      console.error(error);
    }
  };

  const handleLogout = () => {
    console.log("Botón presionado - Ejecutando Alert");

    if (Platform.OS === 'web') {
      if (confirm("¿Quieres salir de NoteStack?")) {
        performLogout();
      }
      return;
    }

    Alert.alert(
      "Cerrar Sesión",
      "¿Quieres salir de NoteStack?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Salir", style: "destructive", onPress: performLogout }
      ],
      { cancelable: true }
    );
  };

  return (
    <TouchableOpacity 
      onPress={handleLogout} 
      style={variant === 'full' ? [styles.fullButton, { backgroundColor: theme.card, borderColor: '#FF3B30' }] : styles.iconButton}
      hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
    >
      <Ionicons 
        name="log-out-outline" 
        size={variant === 'full' ? 20 : 24} 
        color={variant === 'full' ? "#FF3B30" : theme.text} 
      />
      {variant === 'full' && <Text style={styles.fullButtonText}>Cerrar Sesión</Text>}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iconButton: { padding: 8, zIndex: 999 }, 
  fullButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: 20,
    gap: 10,
    zIndex: 999
  },
  fullButtonText: { color: '#FF3B30', fontWeight: 'bold', fontSize: 16 }
});