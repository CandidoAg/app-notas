import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { ThemeSwitch } from './ThemeSwitch';
import { LogoutButton } from './LogoutButton';

interface DetailHeaderProps {
  onBack: () => void;
}

export function DetailHeader({ onBack }: DetailHeaderProps) {  
  const { theme, themeMode, toggleTheme } = useTheme();
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.tint} />
        <Text style={[styles.backText, { color: theme.tint }]}>Volver</Text>
      </TouchableOpacity>
  
      <ThemeSwitch themeMode={themeMode} onToggle={toggleTheme} />
      <LogoutButton />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
    width: '100%',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  backText: {
    fontSize: 18,
    fontWeight: '700'
  },
  themeBtn: { padding: 10, borderRadius: 12 },
});