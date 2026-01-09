import React from 'react';
import { TouchableOpacity, StyleSheet, View, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ThemeSwitchProps {
  themeMode: 'light' | 'dark';
  onToggle: () => void;
}

export const ThemeSwitch = ({ themeMode, onToggle }: ThemeSwitchProps) => {
  const isDark = themeMode === 'dark';

  return (
    <TouchableOpacity 
      onPress={onToggle} 
      activeOpacity={0.8}
      style={[
        styles.container, 
        { backgroundColor: isDark ? '#3A3A3C' : '#E9E9EB' }
      ]}
    >
      <View style={[
        styles.circle, 
        { 
          backgroundColor: isDark ? '#5856D6' : '#FFCC00',
          alignSelf: isDark ? 'flex-end' : 'flex-start' 
        }
      ]}>
        <Ionicons 
          name={isDark ? 'moon' : 'sunny'} 
          size={14} 
          color="#FFF" 
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 56,
    height: 32,
    borderRadius: 16,
    padding: 4,
    justifyContent: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});