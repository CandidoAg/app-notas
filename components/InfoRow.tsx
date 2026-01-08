import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InfoRowProps {
  icon: string;
  label: string;
  value: string;
  color: string;
  theme: any;
}

export function InfoRow({ icon, label, value, color, theme }: InfoRowProps) {
  return (
    <View style={styles.infoRow}>
      <View style={[styles.infoIconBox, { backgroundColor: color + '15' }]}>
        <Ionicons name={icon as any} size={18} color={color} />
      </View>
      <View>
        <Text style={[styles.infoLabel, { color: theme.icon }]}>{label}</Text>
        <Text style={[styles.infoValue, { color: theme.text }]}>{value}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infoRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 25,
    width: '100%' 
  },
  infoIconBox: { 
    padding: 10, 
    borderRadius: 12, 
    marginRight: 15 
  },
  infoLabel: { 
    fontSize: 12, 
    fontWeight: '600', 
    marginBottom: 2, 
    textTransform: 'uppercase' 
  },
  infoValue: { 
    fontSize: 16, 
    fontWeight: '700' 
  },
});