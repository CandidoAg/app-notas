import React from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View, Text, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TaskInputProps {
  value: string;
  onChange: (text: string) => void;
  onAdd: () => void;
  theme: any;
  selectedCat: {
    id: string;
    color: string;
  };
  onOpenMenu: () => void;
}

export function TaskInput({ value, onChange, onAdd, theme, selectedCat, onOpenMenu }: TaskInputProps) {
  return (
    <View style={[styles.inputBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <TextInput style={[styles.input, { color: theme.text }]} placeholder="¿Qué hay que hacer?" value={value}
                 onChangeText={onChange}placeholderTextColor={theme.icon}maxLength={40}/>
      
      <View style={[styles.actionsContainer, { backgroundColor: theme.actionBox }]}>
        <TouchableOpacity style={styles.categoryPicker} onPress={onOpenMenu}>
          <View style={[styles.colorDot, { backgroundColor: selectedCat.color }]} />
          <Text style={[styles.catLabelText, { color: selectedCat.color }]}>{selectedCat.id}</Text>
          <Ionicons name="chevron-down" size={12} color={selectedCat.color} />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.addButton, { backgroundColor: selectedCat.color }]} 
          onPress={onAdd}>
          <Ionicons name="add" size={28} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 6,
    height: 56,
    borderRadius: 22,
    borderWidth: 1,
    marginBottom: 25,
    width: '100%',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    ...Platform.select({ web: { outlineStyle: 'none' } as any })
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12,
    borderRadius: 18,
    height: 44,
  },
  categoryPicker: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 10,
    gap: 6
  },
  colorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  catLabelText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  addButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4
  },
});