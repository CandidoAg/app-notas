import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HeaderProps {
  theme: any;
  themeMode: string;
  toggleTheme: () => void;
}

export function Header({ theme, themeMode, toggleTheme }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.text }]}>Mis Notas</Text>
      <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { backgroundColor: theme.icon + '20' }]} >
        <Ionicons name={themeMode === 'dark' ? 'moon' : 'sunny'} size={20} color={theme.tint} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  title: { fontSize: 28, fontWeight: '800' },
  themeBtn: { padding: 10, borderRadius: 12 },
});