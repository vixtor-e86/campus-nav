import React from 'react';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

// In a real app, this should be in an .env file
const GOOGLE_MAPS_APIKEY = 'AIzaSyDt8_j3sbvDX-IZsFlhgdiNnIizj1YUaEg'; 

export default function CampusMap({ 
  isMapExpanded, 
  mapStyle, 
  filteredPois, 
  selectedDestination, 
  location,
  mapType = 'standard',
  travelMode = 'WALKING',
  searchQuery = '',
  activeCategory = 'All'
}: any) {
  const origin = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  } : null;

  const destination = selectedDestination ? {
    latitude: selectedDestination.latitude,
    longitude: selectedDestination.longitude
  } : null;

  // We only show markers if a location is selected OR if the user is actively searching/filtering
  const isSearchActive = searchQuery.length > 0 || activeCategory !== 'All';

  return (
    <MapView
      key={isMapExpanded ? 'exp' : 'min'}
      style={mapStyle}
      provider={PROVIDER_GOOGLE}
      mapType={mapType}
      initialRegion={{ latitude: 8.5680, longitude: 7.7175, latitudeDelta: 0.015, longitudeDelta: 0.015 }}
      showsUserLocation={true}
    >
      {filteredPois.map((poi: any) => {
        const isSelected = selectedDestination?.id === poi.id;
        
        // Skip rendering this marker if it's not selected AND the user isn't searching
        if (!isSelected && !isSearchActive) return null;

        return (
          <Marker
            key={poi.id}
            coordinate={{ latitude: poi.latitude, longitude: poi.longitude }}
            title={poi.name}
            // If selected, show Green. Otherwise, show a subtle gray.
            pinColor={isSelected ? '#4CAF50' : '#A0A0A0'}
            // Make unselected markers slightly transparent so they don't clutter
            opacity={isSelected ? 1 : 0.6}
          />
        );
      })}

      {origin && destination && (
        <MapViewDirections
          origin={origin}
          destination={destination}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#007AFF"
          mode={travelMode}
          optimizeWaypoints={true}
          onError={(errorMessage) => {
            console.log('Directions error: ', errorMessage);
          }}
        />
      )}
    </MapView>
  );
}
