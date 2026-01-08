import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailHeaderProps {
  theme: any;
  currentTheme: string | null | undefined;
  onBack: () => void;
  onToggleTheme: () => void;
}

export function DetailHeader({ theme, currentTheme, onBack, onToggleTheme }: DetailHeaderProps) {  
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Ionicons name="arrow-back" size={24} color={theme.tint} />
        <Text style={[styles.backText, { color: theme.tint }]}>Volver</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onToggleTheme} style={[styles.themeBtn, { backgroundColor: theme.icon + '20' }]}>
        <Ionicons name={currentTheme === 'dark' ? 'moon' : 'sunny'} size={20} color={theme.tint} />
      </TouchableOpacity>
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