import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, View, FlatList, Platform, Alert, LayoutAnimation, 
  UIManager, SafeAreaView, TouchableOpacity, Text 
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../context/ThemeContext';

import { db, auth } from '../../lib/firebaseConfig';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  serverTimestamp 
} from 'firebase/firestore';

import { Header } from '../../components/Header';
import { QuoteBox } from '../../components/QuoteBox';
import { TaskInput } from '../../components/TaskInput';
import { TaskItem } from '../../components/TaskItem';
import { CategoryModal } from '../../components/CategoryModal';
import { CATEGORIES } from '../../constants/tasks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { onAuthStateChanged } from 'firebase/auth';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface Task {
  id: string;
  value: string;
  createdAt: any;
  completed: boolean;
  category: string;
  userId: string;
}

export default function Index() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [quote, setQuote] = useState('Cargando inspiración...');
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedCat, setSelectedCat] = useState(CATEGORIES[0]);
  const [showMenu, setShowMenu] = useState(false);

  const router = useRouter();
  const { theme } = useTheme();

useEffect(() => {
  const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
    if (user) {      
      const q = query(
        collection(db, 'tasks'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );

      const unsubscribeFirestore = onSnapshot(q, (snapshot) => {        
        const tasks: Task[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          tasks.push({
            id: doc.id,
            value: data.value,
            completed: data.completed,
            category: data.category,
            userId: data.userId,
            createdAt: data.createdAt?.toDate 
              ? data.createdAt.toDate().toLocaleDateString() 
              : 'Guardando...',
          } as Task);
        });

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setTaskList(tasks);
      });

      return () => unsubscribeFirestore();
      
    } else {
      setTaskList([]);
    }
  });

  fetchQuote();

  return () => unsubscribeAuth();
}, []);

  const fetchQuote = async () => {
    try {
      const response = await fetch('https://zenquotes.io/api/random');
      const data = await response.json();
      setQuote(`"${data[0].q}" — ${data[0].a}`);
    } catch (e) {
      setQuote('"La mejor forma de predecir el futuro es creándolo."');
    }
  };

  const handleAddTask = async () => {
    if (task.trim().length > 0 && auth.currentUser) {
      try {
        await addDoc(collection(db, 'tasks'), {
          value: task,
          completed: false,
          category: selectedCat.id,
          userId: auth.currentUser.uid,
          createdAt: serverTimestamp(),
        });
        setTask('');
      } catch (e) {
        console.error("Error añadiendo tarea:", e);
        Alert.alert("Error", "No se pudo guardar la nota en la nube.");
      }
    }
  };

  const toggleTask = async (id: string, currentStatus: boolean) => {
    try {
      const taskRef = doc(db, 'tasks', id);
      await updateDoc(taskRef, {
        completed: !currentStatus
      });
    } catch (e) {
      console.error("Error actualizando tarea:", e);
    }
  };

  const removeTask = (id: string) => {
    const deleteAction = async () => {
      try {
        await deleteDoc(doc(db, 'tasks', id));
      } catch (e) {
        console.error("Error eliminando tarea:", e);
      }
    };

    if (Platform.OS === 'web') {
      if (confirm("¿Eliminar esta nota?")) deleteAction();
    } else {
      Alert.alert("Eliminar", "¿Seguro que quieres borrar esta nota?", [
        { text: "No" }, 
        { text: "Sí", onPress: deleteAction }
      ]);
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
        <View style={styles.topRow}>
          <Header />
        </View>

        <QuoteBox quote={quote} theme={theme} />

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

        <TaskInput 
          value={task} 
          onChange={setTask} 
          onAdd={handleAddTask} 
          theme={theme} 
          selectedCat={selectedCat} 
          onOpenMenu={() => setShowMenu(true)}
        />

        <FlatList 
          data={filteredTasks} 
          keyExtractor={item => item.id} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent} 
          style={styles.list}
          renderItem={({ item }) => (
            <TaskItem 
              item={item}  
              theme={theme} 
              onToggle={() => toggleTask(item.id, item.completed)} 
              onDelete={() => removeTask(item.id)}
              onPress={async () => { 
                try { 
                  router.push({
                    pathname: '/notas/details',
                    params: { id: item.id } 
                  });
                } catch (e) { 
                  console.error("Error al navegar al detalle", e); 
                } 
              }}
            />
          )}
        />

        <CategoryModal 
          visible={showMenu} 
          theme={theme} 
          selectedCat={selectedCat} 
          onClose={() => setShowMenu(false)}
          onSelect={(cat: any) => {
            setSelectedCat(cat);
            setShowMenu(false);
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: Platform.OS === 'android' ? 40 : 0 },
  content: { 
    flex: 1, 
    paddingTop: 20, 
    paddingHorizontal: 20, 
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center'
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  filterContainer: { 
    flexDirection: 'row', 
    marginBottom: 20, 
    borderRadius: 12, 
    padding: 4, 
    width: '100%' 
  },
  filterButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 10 },
  filterText: { fontSize: 13, fontWeight: '600' },
  list: { width: '100%' },
  listContent: { paddingBottom: 40 },
});