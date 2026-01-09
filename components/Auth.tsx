import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  Alert, ActivityIndicator, KeyboardAvoidingView, 
  Platform, SafeAreaView, Pressable
} from 'react-native';
import { auth } from '../lib/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from './ThemeSwitch';

export function AuthComponent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const { theme, themeMode, toggleTheme } = useTheme();

  const toggleAuthMode = () => {
    setEmail('');
    setPassword('');
    
    setErrorMessage(''); 
    setIsLogin(!isLogin);
  };
  const handleAuth = async () => {
    const cleanEmail = email.trim();
    setErrorMessage(null);

    if (!cleanEmail || !password) {
      setErrorMessage("Por favor, rellena todos los datos.");
      return;
    }

    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, cleanEmail, password);
      } else {
        await createUserWithEmailAndPassword(auth, cleanEmail, password);
      }
    } catch (error: any) {
      console.log("Error Firebase:", error.code);
      
      const errorMessages: Record<string, string> = {
        'auth/invalid-email': "El formato del correo no es válido.",
        'auth/invalid-credential': "Email o contraseña incorrectos.",
        'auth/weak-password': "La contraseña debe tener al menos 6 caracteres.",
        'auth/email-already-in-use': "Este correo ya está registrado.",
        'auth/network-request-failed': "Error de red. Revisa tu conexión."
      };
      
      setErrorMessage(errorMessages[error.code] || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemeSwitch themeMode={themeMode} onToggle={toggleTheme} />
        </View>

        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ width: '100%' }}>
          <View style={[styles.card, { backgroundColor: theme.card }]}>
            <Text style={[styles.title, { color: theme.text }]}>
              {isLogin ? 'Iniciar Sesión' : 'Registro'}
            </Text>

            {errorMessage && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{errorMessage}</Text>
              </View>
            )}

            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Correo electrónico"
              placeholderTextColor={themeMode === 'dark' ? '#777' : '#999'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
            />

            <TextInput
              style={[styles.input, { backgroundColor: theme.background, color: theme.text }]}
              placeholder="Contraseña"
              placeholderTextColor={themeMode === 'dark' ? '#777' : '#999'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.loginButton }]}
              onPress={handleAuth}
              disabled={loading}>
              {loading ? (<ActivityIndicator color="#fff" />) : (
                <Text style={styles.buttonText}>{isLogin ? 'ENTRAR' : 'CREAR CUENTA'}</Text>
              )}
            </TouchableOpacity>

            <Pressable 
              onPress={() => {
                setIsLogin(!isLogin);
                setErrorMessage(null);
              }} 
              style={styles.switch}
            >
              <Text onPress={toggleAuthMode} style={[styles.switchText, { color: theme.text }]}>
                {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
              </Text>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 10 },
  card: { width: '100%', padding: 25, borderRadius: 20, shadowOpacity: 0.1, elevation: 4},
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 25, textAlign: 'center' },
  input: { padding: 15, borderRadius: 12, marginBottom: 15, fontSize: 16 },
  button: { padding: 16, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  switch: { marginTop: 20},
  switchText: { textAlign: 'center', fontWeight: 'bold', textDecorationLine: 'underline' },
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  content: { flex: 1, paddingTop: 60, paddingHorizontal: 20, width: '100%', maxWidth: 600, alignSelf: 'center' },
  
  errorContainer: {
    backgroundColor: 'rgba(255, 59, 48, 0.1)', 
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '600',
  },
});