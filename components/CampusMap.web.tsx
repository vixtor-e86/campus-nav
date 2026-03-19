import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function CampusMap({ 
  isMapExpanded, 
  mapStyle, 
  filteredPois, 
  selectedDestination, 
  location 
}: any) {
  return (
    <View style={[mapStyle, styles.webMapFallback]}>
      <Text style={styles.webMapText}>
        Campus Map is optimized for Mobile (iOS & Android).
      </Text>
      <Text style={styles.webMapSubtext}>
        Use the list below to manage and view campus locations on the web dashboard.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  webMapFallback: {
    backgroundColor: '#F0F2F5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    padding: 20,
  },
  webMapText: {
    color: '#1C1E21',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  webMapSubtext: {
    color: '#606770',
    fontSize: 14,
    textAlign: 'center',
  },
});
