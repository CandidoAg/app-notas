import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, useWindowDimensions, 
  ActivityIndicator, SafeAreaView, Alert, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../context/ThemeContext';
import { db, auth } from '../../lib/firebaseConfig';
import { doc, onSnapshot } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { DetailHeader } from '../../components/DetailHeader';
import { InfoRow } from '../../components/InfoRow';
import { getCategoryById } from '../../constants/tasks';

export default function DetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { height } = useWindowDimensions();
  const { theme } = useTheme();
  const [task, setTask] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        exitWithError("Sesión finalizada", "Acceso restringido.");
      }
    });

    if (!id) {
      setLoading(false);
      return;
    }

    const docRef = doc(db, 'tasks', id);
    const unsubscribeFirestore = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (auth.currentUser && data.userId !== auth.currentUser.uid) {
             exitWithError("Seguridad", "No tienes permisos para ver este contenido.");
             return;
          }
          setTask({
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toLocaleDateString() : 'Reciente'
          });
          setLoading(false);
        } else {
          if (!loading) {
            exitWithError("Contenido no disponible", "El recurso ha sido eliminado.");
          } else {
            router.replace('/notas');
          }
        }
      }, 
      () => {
        exitWithError("Error de acceso", "No se puede cargar la información solicitada.");
      }
    );

    return () => {
      unsubscribeAuth();
      unsubscribeFirestore();
    };
  }, [id]);

  const exitWithError = (title: string, message: string) => {
    setTask(null);
    setLoading(false);
    if (Platform.OS === 'web') {
      setTimeout(() => {
        window.alert(message);
        window.requestAnimationFrame(() => {
          router.replace('/notas');
        });
      }, 1000);
    } else {
      Alert.alert(title, message, [{ text: "Volver", onPress: () => router.replace('/notas') }]);
    }
  };

  if (loading || !task) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={theme.tint} />
      </View>
    );
  }

  const categoryInfo = getCategoryById(task.category);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { marginTop: height * 0.02 }]}>
        <DetailHeader onBack={() => router.back()} />
        <View style={[styles.card, { backgroundColor: theme.card }]}>
          <View style={[styles.headerCard, task.completed ? { backgroundColor: '#4CAF50' } : { backgroundColor: theme.tint + '20' }]}>
            <Ionicons name={task.completed ? "checkmark-done-circle" : "document-text-outline"} size={32} color={task.completed ? "#FFF" : theme.tint} />
            <Text style={[styles.taskTitle, { color: task.completed ? "#FFF" : theme.text }]}>{task.value}</Text>
          </View>
          <View style={styles.body}>
            <InfoRow icon="calendar-outline" label="Creada" value={task.createdAt} color={theme.tint} theme={theme} />
            <InfoRow icon={categoryInfo.icon as any} label="Categoría" value={categoryInfo.id} color={categoryInfo.color} theme={theme} />
          </View>
          <View style={[styles.footer, { borderTopColor: theme.border + '30' }]}>
            <Text style={[styles.idText, { color: theme.icon }]}>REF: {task.id}</Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 20, maxWidth: 600, alignSelf: 'center', width: '100%' },
  card: { borderRadius: 24, marginTop: 20, overflow: 'hidden', elevation: 5, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 12 },
  headerCard: { padding: 25, flexDirection: 'row', alignItems: 'center', gap: 15 },
  taskTitle: { fontSize: 22, fontWeight: 'bold', flex: 1 },
  body: { padding: 24, gap: 20 },
  footer: { padding: 15, borderTopWidth: 1, alignItems: 'center' },
  idText: { fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
});