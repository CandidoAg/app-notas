import React from 'react';
import { Modal, Pressable, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { CATEGORIES } from '../constants/tasks';

interface CategoryModalProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (cat: any) => void;
  selectedCat: any;
  theme: any;
}

export function CategoryModal({ visible, onClose, onSelect, selectedCat, theme }: CategoryModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable style={styles.modalOverlay} onPress={onClose}>
        <View style={[styles.menuContent, { backgroundColor: theme.card }]}>
          <Text style={styles.menuTitle}>Categoría</Text>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} onPress={() => onSelect(cat)}
                              style={[styles.menuOption, selectedCat.id === cat.id && { backgroundColor: theme.background }]}>
              <Ionicons name={cat.icon as any} size={20} color={cat.color} />
              <Text style={[styles.menuOptionText, { color: theme.text }, 
                    selectedCat.id === cat.id && { color: cat.color, fontWeight: '700' }]}>
                {cat.id}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    backgroundColor: 'rgba(0,0,0,0.4)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  menuContent: { 
    borderRadius: 24, 
    width: 280, 
    padding: 16, 
    elevation: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  menuTitle: { 
    fontSize: 14, 
    fontWeight: '800', 
    marginBottom: 15, 
    textAlign: 'center', 
    color: '#8E8E93', 
    textTransform: 'uppercase' 
  },
  menuOption: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 12, 
    borderRadius: 14, 
    marginBottom: 4 
  },
  menuOptionText: { 
    flex: 1, 
    marginLeft: 12, 
    fontSize: 16 
  },
});