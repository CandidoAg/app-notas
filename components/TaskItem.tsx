import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getCategoryById } from '../constants/tasks';

interface TaskItemProps {
  item: {
    id: string;
    value: string;
    completed: boolean;
    category: string;
  };
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onPress: () => void;
  theme: any;
}

export function TaskItem({ item, onToggle, onDelete, onPress, theme }: TaskItemProps) {
  const catInfo = getCategoryById(item.category);

  return (
    <View style={[styles.taskCard, { backgroundColor: theme.card }, item.completed && { opacity: 0.6 }]}>
      <TouchableOpacity onPress={() => onToggle(item.id)} style={styles.checkIcon}>
        <Ionicons  name={item.completed ? "checkmark-circle" : "ellipse-outline"}  size={24}  
                   color={item.completed ? "#4CAF50" : theme.icon} />
      </TouchableOpacity>

      <TouchableOpacity style={styles.taskContent} onPress={onPress}>
        <View style={styles.row}>
          <Text style={[styles.taskText, { color: theme.text }, item.completed && styles.taskTextCompleted]} numberOfLines={1}>
            {item.value}
          </Text>
          <View style={[styles.inlineBadge, { backgroundColor: catInfo.color + '15' }]}>
            <Ionicons name={catInfo.icon as any} size={10} color={catInfo.color} />
            <Text style={[styles.inlineBadgeText, { color: catInfo.color }]}>{item.category}</Text>
          </View>
        </View>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={18} color="#FF3B30" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  taskCard: { 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 10, 
    flexDirection: 'row', 
    alignItems: 'center',
    width: '100%' 
  },
  taskContent: { flex: 1 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  taskText: { fontSize: 15, fontWeight: '500', flexShrink: 1, marginRight: 8 },
  taskTextCompleted: { textDecorationLine: 'line-through', opacity: 0.5 },
  inlineBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 8, 
    paddingVertical: 4, 
    borderRadius: 8, 
    gap: 4 
  },
  inlineBadgeText: { fontSize: 9, fontWeight: '800', textTransform: 'uppercase' },
  checkIcon: { marginRight: 12 },
  deleteBtn: { marginLeft: 10 },
});