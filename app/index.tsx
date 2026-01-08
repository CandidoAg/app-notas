import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, FlatList, Platform, Alert, LayoutAnimation, UIManager, useColorScheme, SafeAreaView,
         TouchableOpacity,Text} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useFocusEffect } from 'expo-router';
import { Header } from '../components/Header';
import { QuoteBox } from '../components/QuoteBox';
import { TaskInput } from '../components/TaskInput';
import { TaskItem } from '../components/TaskItem';
import { CategoryModal } from '../components/CategoryModal';
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



export default function Index() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [quote, setQuote] = useState('Cargando inspiración...');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [showMenu, setShowMenu] = useState(false);
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>();

  const systemColorScheme = useColorScheme();
  const currentTheme = themeMode || systemColorScheme || 'light';
  const theme = Colors[currentTheme === 'dark' ? 'dark' : 'light'];

  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      const syncTheme = async () => {
        const savedTheme = await AsyncStorage.getItem('@theme_mode');
        if (savedTheme && savedTheme !== themeMode) {
          setThemeMode(savedTheme as any);
        }
      };
      syncTheme();
    }, [themeMode])
  );

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
    fetchQuote();
  }, []);



  useEffect(() => {
    AsyncStorage.setItem('@my_tasks', JSON.stringify(taskList));
  }, [taskList]);



  const fetchQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      setQuote(`"${data[0].q}" — ${data[0].a}`);
    } catch (e) {
      setQuote('"La mejor forma de predecir el futuro es creándolo."');
    }
  };



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

      setTaskList([newTask, ...taskList]);
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
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <Header theme={theme} themeMode={currentTheme} toggleTheme={toggleTheme} />
        <QuoteBox quote={quote} theme={theme} />

        <View style={[styles.filterContainer, { backgroundColor: theme.filterBar }]}>
          {(['all', 'pending', 'completed'] as const).map((f) => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} 
                              style={[styles.filterButton, filter === f && { backgroundColor: theme.filterBtnActive }]}>
              <View>
                <Text style={[styles.filterText, { color: filter === f ? theme.tint : theme.icon }]}>
                  {f === 'all' ? 'Todas' : f === 'pending' ? 'Pendientes' : 'Hechas'}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TaskInput value={task} onChange={setTask} onAdd={handleAddTask} theme={theme} selectedCat={selectedCat} 
                   onOpenMenu={() => setShowMenu(true)}/>

        <FlatList data={filteredTasks} keyExtractor={item => item.id} showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent} style={styles.list}
          renderItem={({ item }) => (
            <TaskItem item={item}  theme={theme} onToggle={toggleTask} onDelete={removeTask}
                      onPress={async () => { 
                        try { 
                          await AsyncStorage.setItem('@selected_task', JSON.stringify(item)); 
                          router.push('/details'); 
                        } catch (e) { 
                          console.error("Error al guardar tarea para detalle", e); 
                        } 
                      }}
            />
          )}
        />

        <CategoryModal visible={showMenu} theme={theme} selectedCat={selectedCat} onClose={() => setShowMenu(false)}
          onSelect={(cat: any) => {
            setSelectedCat(cat);
            setShowMenu(false);
          }}/>
      </View>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    paddingTop: Platform.OS === 'android' ? 40 : 0, 
  },

  content: { 
    flex: 1, 
    paddingTop: 60, 
    paddingHorizontal: 20, 
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center'
  },

  filterContainer: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    borderRadius: 12, 
    padding: 4, 
    width: '100%' 
  },

  filterButton: { 
    flex: 1, 
    paddingVertical: 10, 
    alignItems: 'center', 
    borderRadius: 10 
  },

  filterText: { 
    fontSize: 13, 
    fontWeight: '600' 
  },

  list: { 
    width: '100%' 
  },

  listContent: { 
    paddingBottom: 40 
  },
});