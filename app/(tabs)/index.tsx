import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Dimensions, ActivityIndicator, Alert, ScrollView, TextInput } from 'react-native';
import CampusMap from '@/components/CampusMap';
import * as Location from 'expo-location';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/lib/supabase';

const CATEGORIES = ['All', 'Faculty', 'Lecture Theatre', 'Auditorium', 'Administrative', 'Gate'];

export default function CampusNav() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [pois, setPois] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedDestination, setSelectedDestination] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [mapType, setMapType] = useState('standard');
  const [travelMode, setTravelMode] = useState('WALKING');

  useEffect(() => {
    fetchLocations();
    setupLocation();
  }, []);

  const fetchLocations = async () => {
    const { data, error } = await supabase.from('locations').select('*');
    if (error) {
      console.error('Error fetching locations:', error);
      Alert.alert('Database Error', 'Could not load campus data.');
      setPois([]); // Ensure it is an empty array
    } else {
      setPois(data || []);
    }
  };

  const setupLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setLoading(false);
      return;
    }
    try {
      let current = await Location.getCurrentPositionAsync({});
      setLocation(current);
    } catch (e) {} finally {
      setLoading(false);
    }
    Location.watchPositionAsync({ accuracy: Location.Accuracy.High, distanceInterval: 10 }, (loc) => setLocation(loc));
  };

  const filteredPois = useMemo(() => {
    return pois.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, pois]);

  if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color="#007AFF" /><Text>Syncing Campus Data...</Text></View>;

  return (
    <SafeAreaView style={styles.safeContainer} edges={['top']}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        
        {/* Unified Top Navigation & Search */}
        {!isMapExpanded && (
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <IconSymbol name="house.fill" size={20} color="#999" />
              <TextInput 
                style={styles.searchInput}
                placeholder="Search FPN Campus..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <IconSymbol name="trash.fill" size={20} color="#999" />
                </TouchableOpacity>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.catScroll}>
              {CATEGORIES.map(cat => (
                <TouchableOpacity 
                  key={cat} 
                  onPress={() => setActiveCategory(cat)}
                  style={[styles.catChip, activeCategory === cat && styles.catChipActive]}
                >
                  <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>{cat}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Map Controls */}
        <View style={styles.controlsRow}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.modesList}>
            {[
              { id: 'WALKING', label: 'Walk', icon: 'paperplane.fill' },
              { id: 'DRIVING', label: 'Car', icon: 'house.fill' },
              { id: 'BICYCLING', label: 'Bike', icon: 'paperplane.fill' },
            ].map(mode => (
              <TouchableOpacity 
                key={mode.id} 
                style={[styles.modeBtn, travelMode === mode.id && styles.modeBtnActive]}
                onPress={() => setTravelMode(mode.id)}
              >
                <Text style={[styles.modeText, travelMode === mode.id && styles.modeTextActive]}>{mode.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          
          <TouchableOpacity 
            style={[styles.satBtn, mapType === 'satellite' && styles.satBtnActive]}
            onPress={() => setMapType(mapType === 'standard' ? 'satellite' : 'standard')}
          >
            <IconSymbol name="map.fill" size={18} color={mapType === 'satellite' ? '#FFF' : '#007AFF'} />
            <Text style={[styles.satText, mapType === 'satellite' && styles.satTextActive]}>Sat</Text>
          </TouchableOpacity>
        </View>

        {/* Map UI */}
        <View style={[styles.mapWrapper, isMapExpanded ? styles.mapExpanded : styles.mapMinimized]}>
          <CampusMap
            isMapExpanded={isMapExpanded}
            mapStyle={styles.map}
            filteredPois={filteredPois}
            selectedDestination={selectedDestination}
            location={location}
            mapType={mapType}
            travelMode={travelMode}
            searchQuery={searchQuery}
            activeCategory={activeCategory}
          />
          <TouchableOpacity style={styles.expandFab} onPress={() => setIsMapExpanded(!isMapExpanded)}>
            <IconSymbol size={24} name={isMapExpanded ? "chevron.left" : "chevron.right"} color="#FFF" />
          </TouchableOpacity>
        </View>

        {/* Dynamic Card List */}
        {!isMapExpanded && (
          <ScrollView style={styles.listContainer}>
            <Text style={styles.resTitle}>{filteredPois.length} Locations Found</Text>
            {filteredPois.map(poi => (
              <TouchableOpacity key={poi.id} style={[styles.poiRow, selectedDestination?.id === poi.id && styles.selectedRow]} onPress={() => setSelectedDestination(poi)}>
                <View style={styles.rowIcon}><IconSymbol name="mappin.circle.fill" size={24} color="#007AFF" /></View>
                <View>
                  <Text style={styles.rowName}>{poi.name}</Text>
                  <Text style={styles.rowCat}>{poi.category}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: { flex: 1, backgroundColor: '#FFF' },
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#FFF', paddingBottom: 10, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F0F0F0', margin: 15, paddingHorizontal: 15, borderRadius: 12, height: 45 },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 16 },
  catScroll: { paddingHorizontal: 15 },
  catChip: { paddingHorizontal: 15, paddingVertical: 8, borderRadius: 20, backgroundColor: '#EEE', marginRight: 8 },
  catChipActive: { backgroundColor: '#007AFF' },
  catText: { fontSize: 13, color: '#666' },
  catTextActive: { color: '#FFF', fontWeight: 'bold' },
  mapWrapper: { overflow: 'hidden' },
  mapMinimized: { height: 300, margin: 15, borderRadius: 20 },
  mapExpanded: { flex: 1 },
  map: { flex: 1 },
  expandFab: { position: 'absolute', bottom: 15, right: 15, backgroundColor: '#007AFF', width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  listContainer: { flex: 1, padding: 15 },
  resTitle: { fontSize: 14, fontWeight: 'bold', color: '#999', marginBottom: 10 },
  poiRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 15, borderRadius: 12, marginBottom: 8 },
  selectedRow: { borderColor: '#007AFF', borderWidth: 2 },
  rowIcon: { marginRight: 15 },
  rowName: { fontSize: 16, fontWeight: 'bold' },
  rowCat: { fontSize: 12, color: '#999' },
  controlsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#FFF', 
    paddingVertical: 10, 
    paddingHorizontal: 15, 
    borderBottomWidth: 1, 
    borderBottomColor: '#EEE' 
  },
  modesList: { paddingRight: 10 },
  modeBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8, 
    backgroundColor: '#F0F0F0', 
    marginRight: 8,
    flexDirection: 'row',
    alignItems: 'center'
  },
  modeBtnActive: { backgroundColor: '#007AFF' },
  modeText: { fontSize: 12, color: '#666' },
  modeTextActive: { color: '#FFF', fontWeight: 'bold' },
  satBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F0F0F0', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 8 
  },
  satBtnActive: { backgroundColor: '#007AFF' },
  satText: { fontSize: 12, color: '#007AFF', marginLeft: 5, fontWeight: 'bold' },
  satTextActive: { color: '#FFF' }
});
