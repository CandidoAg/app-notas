import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Platform, useWindowDimensions,StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCategoryById } from '../constants/tasks';
import { Colors } from '../constants/theme';

export default function DetailsScreen() {
  const { id, value, createdAt, completed, category } = useLocalSearchParams();
  const router = useRouter();

  const { height } = useWindowDimensions();
  
  // Lógica de Modo Oscuro
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    AsyncStorage.getItem('@theme_mode').then(m => m && setThemeMode(m));
  }, []);

  const currentTheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const theme = Colors[currentTheme === 'dark' ? 'dark' : 'light'];

  const isCompleted = completed === 'true';
  const categoryInfo = getCategoryById(category as string);

  const formatDate = (dateStr: string | string[]) => {
    if (!dateStr) return '--/--/--';
    const d = new Date(dateStr.toString());
    if (isNaN(d.getTime())) return dateStr; 
    return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
  };

  const toggleTheme = () => {
    const nextMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    AsyncStorage.setItem('@theme_mode', nextMode);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.webHeader, { marginTop: height * 0.15 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.webBackButton}>
          <Ionicons name="arrow-back" size={20} color={theme.text} />
          <Text style={[styles.backText, { color: theme.tint }]}>Volver</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: theme.icon + '20' }]}>
          <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={20} color={theme.tint} />
        </TouchableOpacity>
      </View>

      <View style={[styles.card, { backgroundColor: currentTheme === 'dark' ? '#1C1C1E' : '#FFF', borderColor: theme.icon + '20', borderWidth: 1 }]}>
        <View style={[styles.headerCard, isCompleted ? { backgroundColor: currentTheme === 'dark' ? '#81C784' : '#81C784' } : { backgroundColor:  theme.background + '10' }]}>
          <View style={styles.headerLeft}>
            <View style={styles.iconContainer}>
              <Ionicons name={isCompleted ? "checkmark-done-circle" : "time"} size={24} color={theme.icon } />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.taskTitleHeader}>{value}</Text>
            </View>
          </View>

          <View style={[styles.stateBadge, { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
            <View style={[styles.dot, { backgroundColor: '#FFF' }]} />
            <Text style={[styles.stateBadgeText, { color: '#FFF' }]}>
              {isCompleted ? 'Finalizada' : 'En curso'}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <View style={styles.infoRow}>
            <Ionicons name="calendar-outline" size={18} color={theme.icon} />
            <Text style={[styles.infoText, { color: theme.icon }]}>Creado: <Text> {formatDate(createdAt)} </Text></Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name={categoryInfo.icon as any} size={18} color={theme.icon} />
            <Text style={[styles.infoText, { color: theme.icon }]}>Categoría: <Text> {category || 'General'} </Text></Text>
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: theme.icon + '20' }]}>
            <Text style={[styles.idFooterText, { color: theme.icon }]}>ID: {id?.toString()}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center', paddingTop: 60 },
  themeBtn: { padding: 8, borderRadius: 12 },
  webHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 500, marginBottom: 20 },
  webBackButton: { flexDirection: 'row', alignItems: 'center' },
  backText: { marginLeft: 8, fontSize: 16, fontWeight: '600' },
  card: { borderRadius: 24, width: '100%', maxWidth: 500, overflow: 'hidden', elevation: 5 },
  headerCard: { padding: 25, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerLeft: { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 },
  textContainer: { flex: 1 },
  iconContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 10, borderRadius: 12, marginRight: 15 },
  taskTitleHeader: { color: '#FFF', fontSize: 16, fontWeight: 'bold', lineHeight: 20 },
  content: { padding: 25 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  infoText: { marginLeft: 10, fontSize: 14 },
  stateBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  stateBadgeText: { fontSize: 11, fontWeight: '800' },
  footer: { padding: 15, borderTopWidth: 1, alignItems: 'center' },
  idFooterText: { fontSize: 10, letterSpacing: 1 }
});