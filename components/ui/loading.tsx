import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React from 'react';

export default function Loading() {
  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
      <Text style={styles.text}>Enviando dados...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'hsla(0, 0%, 0%, 0.539)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  text: {
    marginTop: 12,
    color: '#fff',
    fontSize: 16,
  },
});