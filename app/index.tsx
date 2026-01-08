import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, 
  Platform, Alert, LayoutAnimation, UIManager, Modal, Pressable, useColorScheme 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons'; 
import { useRouter } from 'expo-router';
import { CATEGORIES, getCategoryById } from '../constants/tasks';
import { Colors } from '../constants/theme';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Task {
  id: string;
  value: string;
  createdAt: string;
  completed: boolean;
  category: string;
}

export default function Page() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [quote, setQuote] = useState('Cargando inspiración...');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [showMenu, setShowMenu] = useState(false);
  
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>();
  const currentTheme = themeMode || systemColorScheme || 'light';
  const theme = Colors[currentTheme === 'dark' ? 'dark' : 'light'];
  
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [savedTasks, savedTheme] = await Promise.all([
          AsyncStorage.getItem('@my_tasks'),
          AsyncStorage.getItem('@theme_mode')
        ]);
        if (savedTasks) setTaskList(JSON.parse(savedTasks));
        if (savedTheme) setThemeMode(savedTheme as any);
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('@my_tasks', JSON.stringify(taskList));
  }, [taskList]);

  const toggleTheme = () => {
    const nextMode = currentTheme === 'light' ? 'dark' : 'light';
    setThemeMode(nextMode);
    AsyncStorage.setItem('@theme_mode', nextMode);
  };

  const handleAddTask = () => {
    if (task.trim().length > 0) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      const newTask: Task = { 
        id: Date.now().toString(), 
        value: task,
        createdAt: new Date().toLocaleDateString(),
        completed: false,
        category: selectedCat.id,
      };
      setTaskList([...taskList, newTask]);
      setTask('');
    }
  };

  const toggleTask = (id: string) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setTaskList(taskList.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const removeTask = (id: string) => {
    const deleteAction = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setTaskList(taskList.filter(item => item.id !== id));
    };
    if (Platform.OS === 'web') {
      if (confirm("¿Eliminar?")) deleteAction();
    } else {
      Alert.alert("Eliminar", "¿Seguro?", [{ text: "No" }, { text: "Sí", onPress: deleteAction }]);
    }
  };

  const filteredTasks = taskList.filter(t => {
    if (filter === 'pending') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true; 
  });

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: theme.text }]}>Mis Tareas</Text>
        <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: theme.icon + '20' }]}>
          <Ionicons name={currentTheme === 'dark' ? 'moon' : 'sunny'} size={20} color={theme.tint} />
        </TouchableOpacity>
      </View>
      
      {/* Quote */}
      <View style={[styles.quoteBox, { backgroundColor: theme.quoteColor + "15"}]}>
        <Ionicons name="bulb-outline" size={18} color={theme.quoteColor} />
        <Text style={[styles.quoteText, { color: theme.text }]}>{quote}</Text>
      </View>

      {/* Filter Bar */}
      <View style={[styles.filterContainer, { backgroundColor: theme.filterBar }]}>
        {(['all', 'pending', 'completed'] as const).map((f) => (
          <TouchableOpacity 
            key={f} 
            onPress={() => setFilter(f)}
            style={[styles.filterButton, filter === f && { backgroundColor: theme.filterBtnActive }]}
          >
            <Text style={[styles.filterText, { color: filter === f ? theme.tint : theme.icon }]}>
              {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Hechas'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Input Bar */}
      <View style={[styles.inputBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
        <TextInput 
          style={[styles.input, { color: theme.text }]} 
          placeholder="¿Qué hay que hacer?" 
          value={task}
          onChangeText={setTask}
          placeholderTextColor={theme.icon}
          maxLength={40}
        />
        <View style={[styles.actionsContainer, { backgroundColor: theme.actionBox }]}>
          <TouchableOpacity style={styles.categoryPicker} onPress={() => setShowMenu(true)}>
            <View style={[styles.colorDot, { backgroundColor: selectedCat.color }]} />
            <Text style={[styles.catLabelText, { color: selectedCat.color }]}>{selectedCat.id}</Text>
            <Ionicons name="chevron-down" size={12} color={selectedCat.color} />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.addButton, { backgroundColor: selectedCat.color }]} onPress={handleAddTask}>
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Task List */}
      <FlatList 
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const catInfo = getCategoryById(item.category);
          const statusColor = item.completed ? theme.status.completed : theme.icon;

          return (
            <View style={[styles.taskCard, { backgroundColor: theme.card }, item.completed && { opacity: 0.6 }]}>
              <TouchableOpacity onPress={() => toggleTask(item.id)} style={styles.checkIcon}>
                <Ionicons 
                  name={item.completed ? "checkmark-circle" : "ellipse-outline"} 
                  size={24} 
                  color={statusColor} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.taskContent} 
                onPress={() => router.push({ pathname: '/details', params: { ...item, completed: item.completed.toString() } })}
              >
                <View style={styles.row}>
                  <Text style={[
                    styles.taskText, 
                    { color: item.completed ? theme.status.textDone : theme.text }, 
                    item.completed && styles.taskTextCompleted
                  ]} numberOfLines={1}>
                    {item.value}
                  </Text>
                  <View style={[styles.inlineBadge, { backgroundColor: catInfo.color + '15' }]}>
                    <Ionicons name={catInfo.icon as any} size={10} color={catInfo.color} />
                    <Text style={[styles.inlineBadgeText, { color: catInfo.color }]}>{item.category}</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={() => removeTask(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color={item.completed ? theme.icon : "#FF3B30"} />
              </TouchableOpacity>
            </View>
          );
        }}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />

      <Modal visible={showMenu} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setShowMenu(false)}>
          <View style={[styles.menuContent, { backgroundColor: theme.card }]}>
            <Text style={styles.menuTitle}>Categoría</Text>
            {CATEGORIES.map((cat) => (
              <TouchableOpacity 
                key={cat.id} 
                style={[styles.menuOption, selectedCat.id === cat.id && { backgroundColor: theme.background }]} 
                onPress={() => { setSelectedCat(cat); setShowMenu(false); }}
              >
                <Ionicons name={cat.icon as any} size={20} color={cat.color} />
                <Text style={[styles.menuOptionText, { color: theme.text }, selectedCat.id === cat.id && { color: cat.color, fontWeight: '700' }]}>{cat.id}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 60, paddingHorizontal: 20, alignItems: 'center' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%', maxWidth: 500, marginBottom: 25 },
  title: { fontSize: 34, fontWeight: '800' },
  themeBtn: { padding: 8, borderRadius: 12 },
  quoteBox: { padding: 15, borderRadius: 12, marginBottom: 20, flexDirection: 'row', alignItems: 'center', width: '100%', maxWidth: 500 },
  quoteText: { fontSize: 13, fontStyle: 'italic', marginLeft: 10, flex: 1 },
  filterContainer: { flexDirection: 'row', marginBottom: 20, borderRadius: 12, padding: 4, width: '100%', maxWidth: 500 },
  filterButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  filterText: { fontSize: 13, fontWeight: '600' },
  inputBar: { flexDirection: 'row', borderRadius: 22, paddingVertical: 6, paddingLeft: 16, paddingRight: 6, alignItems: 'center', width: '100%', maxWidth: 500, marginBottom: 25, borderWidth: 1, elevation: 4 },
  input: { flex: 1, fontSize: 16, height: 50, ...Platform.select({ web: { outlineStyle: 'none' } as any }) },
  actionsContainer: { flexDirection: 'row', alignItems: 'center', borderRadius: 18, padding: 4 },
  categoryPicker: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, gap: 6 },
  colorDot: { width: 8, height: 8, borderRadius: 4 },
  catLabelText: { fontSize: 10, fontWeight: '800', textTransform: 'uppercase' },
  addButton: { width: 40, height: 40, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 4 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  menuContent: { borderRadius: 24, width: 280, padding: 16, elevation: 20 },
  menuTitle: { fontSize: 14, fontWeight: '800', marginBottom: 15, textAlign: 'center', color: '#8E8E93', textTransform: 'uppercase' },
  menuOption: { flexDirection: 'row', alignItems: 'center', padding: 12, borderRadius: 14, marginBottom: 4 },
  menuOptionText: { flex: 1, marginLeft: 12, fontSize: 16 },
  list: { width: '100%', maxWidth: 500 },
  listContent: { paddingBottom: 40 },
  taskCard: { padding: 16, borderRadius: 20, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  taskContent: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskText: { fontSize: 15, fontWeight: '500', flexShrink: 1, marginRight: 8 },
  inlineBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, gap: 4 },
  inlineBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  checkIcon: { marginRight: 12 },
  deleteBtn: { marginLeft: 10 },
  taskTextCompleted: { textDecorationLine: 'line-through' }
});