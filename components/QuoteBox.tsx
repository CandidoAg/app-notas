import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface QuoteBoxProps {
  quote: string;
  theme: any;
}

export function QuoteBox({ quote, theme }: QuoteBoxProps) {
  return (
    <View style={[styles.quoteBox, { backgroundColor: theme.quoteColor + "15" }]}>
      <Ionicons name="bulb-outline" size={18} color={theme.quoteColor} />
      <Text style={[styles.quoteText, { color: theme.text }]}>{quote}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  quoteBox: { 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 20, 
    flexDirection: 'row', 
    alignItems: 'center', 
    width: '100%' 
  },
  quoteText: { 
    fontSize: 13, 
    fontStyle: 'italic', 
    marginLeft: 10, 
    flex: 1 
  },
});