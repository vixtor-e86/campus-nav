import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';

export default function CampusMap({ 
  isMapExpanded, 
  mapStyle, 
  filteredPois, 
  selectedDestination, 
  location 
}: any) {
  return (
    <MapView
      key={isMapExpanded ? 'exp' : 'min'}
      style={mapStyle}
      provider={PROVIDER_GOOGLE}
      initialRegion={{ latitude: 8.5680, longitude: 7.7175, latitudeDelta: 0.015, longitudeDelta: 0.015 }}
      showsUserLocation={true}
    >
      {filteredPois.map((poi: any) => (
        <Marker
          key={poi.id}
          coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
          title={poi.name}
          pinColor={selectedDestination?.id === poi.id ? '#4CAF50' : '#FF3B30'}
        />
      ))}
      {location && selectedDestination && (
        <Polyline 
          coordinates={[
            { latitude: location.coords.latitude, longitude: location.coords.longitude }, 
            { latitude: selectedDestination.latitude, longitude: selectedDestination.longitude }
          ]} 
          strokeColor="#007AFF" 
          strokeWidth={4} 
        />
      )}
    </MapView>
  );
}
