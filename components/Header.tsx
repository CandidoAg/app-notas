import { StyleSheet, Text, View } from 'react-native';
import { ThemeSwitch } from './ThemeSwitch';
import { useTheme } from '../context/ThemeContext';
import { LogoutButton } from './LogoutButton';

export function Header() {
  const { theme, themeMode, toggleTheme } = useTheme();
  return (
    <View style={styles.header}>
      <Text style={[styles.title, { color: theme.text }]}>Mis Notas</Text>
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
    marginBottom: 20,
    width: '100%',
  },
  title: { fontSize: 28, fontWeight: '800' },
  themeBtn: { padding: 10, borderRadius: 12 },
});