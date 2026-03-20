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
  travelMode = 'WALKING'
}: any) {
  const origin = location ? {
    latitude: location.coords.latitude,
    longitude: location.coords.longitude
  } : null;

  const destination = selectedDestination ? {
    latitude: selectedDestination.latitude,
    longitude: selectedDestination.longitude
  } : null;

  return (
    <MapView
      key={isMapExpanded ? 'exp' : 'min'}
      style={mapStyle}
      provider={PROVIDER_GOOGLE}
      mapType={mapType}
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
