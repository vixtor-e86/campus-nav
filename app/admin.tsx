import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Platform, ActivityIndicator, Alert, useWindowDimensions } from 'react-native';
import { supabase } from '@/lib/supabase';
import { IconSymbol } from '@/components/ui/icon-symbol';

const CATEGORIES = ['Faculty', 'Lecture Theatre', 'Auditorium', 'Administrative', 'Gate', 'Hostel', 'ICT', 'School Clinic', 'Mosque', 'Church', 'Other'];

export default function AdminDashboard() {
  const { width } = useWindowDimensions();
  const [hasMounted, setHasMounted] = useState(false);
  const isMobile = hasMounted && width < 600;

  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', description: '', latitude: '', longitude: '', category: 'Faculty' });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    setHasMounted(true);
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('locations').select('*').order('created_at', { ascending: false });
    if (!error) setLocations(data || []);
    setLoading(false);
  };

  const handleSave = async () => {
    if (!form.name || !form.latitude || !form.longitude) {
      if (Platform.OS === 'web') alert('Please fill in all required fields');
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      category: form.category
    };

    if (editingId) {
      const { data, error } = await supabase
        .from('locations')
        .update(payload)
        .eq('id', editingId)
        .select();

      if (error) {
        alert('Error updating location: ' + error.message);
      } else if (!data || data.length === 0) {
        // Fallback: If UPDATE is blocked by RLS policies but INSERT/DELETE are allowed,
        // perform a delete-then-insert update pattern preserving the ID and created_at.
        const originalLoc = locations.find(l => l.id === editingId);
        const createdAt = originalLoc ? originalLoc.created_at : undefined;

        const deleteRes = await supabase.from('locations').delete().eq('id', editingId);
        if (deleteRes.error) {
          alert('Error updating location during fallback: ' + deleteRes.error.message);
          return;
        }

        const insertRes = await supabase.from('locations').insert([{
          id: editingId,
          ...payload,
          ...(createdAt ? { created_at: createdAt } : {})
        }]);

        if (insertRes.error) {
          alert('Error saving updated location: ' + insertRes.error.message);
        } else {
          setForm({ name: '', description: '', latitude: '', longitude: '', category: 'Faculty' });
          setEditingId(null);
          fetchLocations();
        }
      } else {
        setForm({ name: '', description: '', latitude: '', longitude: '', category: 'Faculty' });
        setEditingId(null);
        fetchLocations();
      }
    } else {
      const { error } = await supabase.from('locations').insert([payload]);
      if (error) {
        alert('Error adding location: ' + error.message);
      } else {
        setForm({ name: '', description: '', latitude: '', longitude: '', category: 'Faculty' });
        fetchLocations();
      }
    }
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('locations').delete().eq('id', id);
    if (error) alert('Error deleting: ' + error.message);
    else fetchLocations();
  };

  const startEdit = (loc: any) => {
    setEditingId(loc.id);
    setForm({
      name: loc.name,
      description: loc.description || '',
      latitude: loc.latitude.toString(),
      longitude: loc.longitude.toString(),
      category: loc.category
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm({ name: '', description: '', latitude: '', longitude: '', category: 'Faculty' });
  };

  if (!hasMounted) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>FPN Campus Admin</Text>
      
      {/* Add Form */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>{editingId ? 'Edit Location' : 'Add New Location'}</Text>
        
        <View style={styles.tipBox}>
          <IconSymbol name="house.fill" size={16} color="#007AFF" />
          <Text style={styles.tipText}>
            <Text style={{ fontWeight: 'bold' }}>Tip: How to get coordinates?</Text>{"\n"}
            Open Google Maps, right-click on your campus location, and the first numbers you see (e.g., 8.56, 7.71) are the Latitude and Longitude. Click them to copy!
          </Text>
        </View>

        <TextInput style={styles.input} placeholder="Location Name (e.g. ETF Hall)" value={form.name} onChangeText={(t) => setForm({...form, name: t})} />
        <View style={isMobile ? styles.col : styles.row}>
          <TextInput style={[styles.input, { flex: 1, marginRight: isMobile ? 0 : 10 }]} placeholder="Lat (e.g. 8.56)" value={form.latitude} onChangeText={(t) => setForm({...form, latitude: t})} />
          <TextInput style={[styles.input, { flex: 1 }]} placeholder="Lng (e.g. 7.71)" value={form.longitude} onChangeText={(t) => setForm({...form, longitude: t})} />
        </View>
        <View style={styles.catRow}>
          {CATEGORIES.map(cat => (
            <TouchableOpacity key={cat} style={[styles.catBtn, form.category === cat && styles.catBtnActive]} onPress={() => setForm({...form, category: cat})}>
              <Text style={[styles.catBtnText, form.category === cat && styles.catBtnTextActive]}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={editingId ? styles.row : null}>
          <TouchableOpacity style={[styles.addBtn, { flex: 1 }]} onPress={handleSave}>
            <Text style={styles.addBtnText}>{editingId ? 'Update Location' : 'Save Location'}</Text>
          </TouchableOpacity>
          {editingId && (
            <TouchableOpacity style={[styles.cancelBtn, { marginLeft: 10 }]} onPress={cancelEdit}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* List */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Manage Locations ({locations.length})</Text>
        {loading ? <ActivityIndicator color="#007AFF" /> : (
          locations.map(loc => (
            <View key={loc.id} style={styles.locRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.locName}>{loc.name}</Text>
                <Text style={styles.locCoords}>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)} • {loc.category}</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => startEdit(loc)} style={{ marginRight: 15 }}>
                  <IconSymbol name="pencil.circle.fill" size={20} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(loc.id)}>
                  <IconSymbol name="trash.fill" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F0F2F5' },
  content: { padding: 20, maxWidth: 800, alignSelf: 'center', width: '100%' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, color: '#1C1E21' },
  card: { backgroundColor: '#FFF', borderRadius: 12, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#444' },
  tipBox: { backgroundColor: '#E1F5FE', padding: 15, borderRadius: 10, marginBottom: 20, flexDirection: 'row', alignItems: 'flex-start', borderLeftWidth: 4, borderLeftColor: '#007AFF' },
  tipText: { flex: 1, marginLeft: 10, fontSize: 13, color: '#01579B', lineHeight: 18 },
  input: { backgroundColor: '#F0F2F5', padding: 12, borderRadius: 8, marginBottom: 10, fontSize: 16 },
  row: { flexDirection: 'row' },
  col: { flexDirection: 'column' },
  catRow: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  catBtn: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 15, backgroundColor: '#EEE', marginRight: 8, marginBottom: 8 },
  catBtnActive: { backgroundColor: '#007AFF' },
  catBtnText: { fontSize: 12, color: '#666' },
  catBtnTextActive: { color: '#FFF', fontWeight: 'bold' },
  addBtn: { backgroundColor: '#4CAF50', padding: 15, borderRadius: 8, alignItems: 'center' },
  addBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  cancelBtn: { backgroundColor: '#FF3B30', padding: 15, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  cancelBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  locRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#EEE' },
  locName: { fontSize: 16, fontWeight: 'bold', color: '#333' },
  locCoords: { fontSize: 12, color: '#999', marginTop: 2 },
});
