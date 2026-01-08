import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, useColorScheme, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

import { DetailHeader } from '../components/DetailHeader';
import { InfoRow } from '../components/InfoRow';
import { Colors } from '../constants/theme';
import { getCategoryById } from '../constants/tasks';

export default function DetailsScreen() {
  const router = useRouter();
  const { height } = useWindowDimensions();
  const systemColorScheme = useColorScheme();

  const [task, setTask] = useState<any>(null);
  const [themeMode, setThemeMode] = useState('system');

  useEffect(() => {
    const loadData = async () => {
      const savedTheme = await AsyncStorage.getItem('@theme_mode');
      const jsonTask = await AsyncStorage.getItem('@selected_task');
      if (savedTheme) setThemeMode(savedTheme);
      if (jsonTask) setTask(JSON.parse(jsonTask));
    };
    loadData();
  }, []);

  const currentTheme = themeMode === 'system' ? systemColorScheme : themeMode;
  const theme = Colors[currentTheme === 'dark' ? 'dark' : 'light'];

  if (!task) return <View style={[styles.container, { backgroundColor: theme.background }]} />;

  const categoryInfo = getCategoryById(task.category);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.content, { marginTop: height * 0.05 }]}>
        <DetailHeader 
          onBack={() => router.back()} theme={theme} currentTheme={currentTheme}
          onToggleTheme={() => {
            const next = currentTheme === 'light' ? 'dark' : 'light';
            setThemeMode(next);
            AsyncStorage.setItem('@theme_mode', next);
          }}
        />

        <View style={[styles.card, { backgroundColor: currentTheme === 'dark' ? '#1C1C1E' : '#FFF', borderColor: theme.border }]}>
          <View style={[styles.headerCard, task.completed === true ? 
                                           { backgroundColor: currentTheme === 'dark' ? '#81C784' : '#81C784' } : 
                                           { backgroundColor:  theme.background + '10' }]}>
            <Ionicons name={task.completed ? "checkmark-done-circle" : "time-outline"} size={28} 
                      color={task.completed ? "#FFF" : theme.tint} />
            <Text style={[styles.taskTitle, task.completed && { color: '#FFF' }]}>{task.value}</Text>
          </View>

          <View style={styles.body}>
            <InfoRow icon="calendar-outline"  label="Fecha de creación"  value={new Date(task.createdAt).toLocaleDateString()} 
                     color={theme.tint}  theme={theme} />
            <InfoRow icon={categoryInfo.icon as any} label="Categoría" value={task.category || 'General'} color={categoryInfo.color} 
                     theme={theme} />
          </View>

          <View style={[styles.footer, { borderTopColor: theme.border }]}>
            <Text style={[styles.idText, { color: theme.icon }]}>ID: {task.id}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center' },
  content: { width: '100%', maxWidth: 500, padding: 20 },
  card: { borderRadius: 24, overflow: 'hidden', borderWidth: 1, elevation: 4, shadowOpacity: 0.1 },
  headerCard: { padding: 20, flexDirection: 'row', alignItems: 'center' },
  taskTitle: { marginLeft: 15, fontSize: 18, fontWeight: '700', flex: 1 },
  body: { padding: 20 },
  footer: { padding: 15, borderTopWidth: 1, alignItems: 'center' },
  idText: { fontSize: 10, letterSpacing: 1 }
});