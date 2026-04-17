import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Animated } from 'react-native';
import MapView, { Marker, Polygon, Polyline, PROVIDER_DEFAULT, UrlTile } from 'react-native-maps';
import { Navigation, AlertCircle } from 'lucide-react-native';

import { bhopalZones } from '../data/bhopalZones';
import { fetchSafeRoute } from '../services/routeService';
import { useLocation } from '../hooks/useLocation';
import { startShakeDetection, stopShakeDetection } from '../services/shakeService';
import { getContacts } from '../services/api';

const getPolygonColor = (risk) => {
  switch (risk) {
    case 'red': return 'rgba(192,57,43,0.35)';
    case 'yellow': return 'rgba(214,137,16,0.30)';
    case 'green': return 'rgba(30,132,73,0.25)';
    default: return 'rgba(100,100,100,0.2)';
  }
};

export default function MapScreen({ navigation }) {
  const { location, errorMsg } = useLocation();
  const mapRef = useRef(null);
  
  const [destination, setDestination] = useState('');
  const [routeData, setRouteData] = useState(null);
  const [contacts, setContacts] = useState([]);
  
  // Custom dark map style
  const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { featureType: 'administrative.locality', elementType: 'labels.text.fill', stylers: [{ color: '#d59563' }] },
    { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#38414e' }] },
    { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#212a37' }] },
    { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9ca5b3' }] },
    { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#17263c' }] },
  ];

  useEffect(() => {
    // Load contacts for pills
    getContacts().then(res => setContacts(res.data)).catch(console.error);

    // Setup shake
    startShakeDetection(() => {
      navigation.navigate('SOS');
    });

    return () => stopShakeDetection();
  }, []);

  const handleSearch = async () => {
    if (!destination || !location) return;
    try {
      // Use OpenStreetMap Nominatim for free geocoding! (Bypasses Google API)
      const geoRes = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(destination + ' Bhopal')}&format=json&limit=1`);
      const geoData = await geoRes.json();
      
      if (!geoData || geoData.length === 0) {
        Alert.alert('Not Found', 'Could not find this destination.');
        return;
      }
      
      const destCoords = { lat: parseFloat(geoData[0].lat), lng: parseFloat(geoData[0].lon) };
      
      const data = await fetchSafeRoute(location, destCoords);
      setRouteData(data);

      if (mapRef.current) {
        mapRef.current.fitToCoordinates(
          data.polyline.map(p => ({ latitude: p[0], longitude: p[1] })),
          { edgePadding: { top: 50, right: 50, bottom: 50, left: 50 }, animated: true }
        );
      }
    } catch (e) {
      Alert.alert('Route Error', 'Could not fetch safe route');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        showsUserLocation={true}
        initialRegion={{
          latitude: 23.2599,
          longitude: 77.4126,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <UrlTile
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        {bhopalZones.map(zone => (
          <Polygon
            key={zone.id}
            coordinates={zone.coordinates}
            fillColor={getPolygonColor(zone.risk)}
            strokeColor={getPolygonColor(zone.risk).replace(/[\d.]+\)$/g, '1)')}
            strokeWidth={2}
          />
        ))}

        {routeData && (
          <Polyline
            coordinates={routeData.polyline.map(p => ({ latitude: p[0], longitude: p[1] }))}
            strokeColor="#3b82f6"
            strokeWidth={4}
            lineDashPattern={[10, 5]}
          />
        )}
      </MapView>

      {/* Top Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Where are you going?"
          placeholderTextColor="#888"
          value={destination}
          onChangeText={setDestination}
          onSubmitEditing={handleSearch}
        />
      </View>

      {/* Contact Pills */}
      <View style={styles.contactsScroll}>
        {contacts.map(c => (
          <View key={c._id} style={styles.contactPill}>
            <View style={[styles.onlineDot, { backgroundColor: c.isOnline ? '#22c55e' : '#6b7280' }]} />
            <Text style={styles.contactPillText}>{c.name}</Text>
          </View>
        ))}
      </View>

      {/* Bottom Sheet Overlay */}
      {routeData && (
        <View style={styles.bottomSheet}>
          <Text style={styles.routeTitle}>Safest Route: {routeData.via}</Text>
          <View style={styles.routeMeta}>
            <Text style={styles.routeText}>{routeData.distance}</Text>
            <Text style={styles.routeText}>{routeData.duration}</Text>
            <Text style={styles.routeText}>Zones Avoided: {routeData.zonesAvoided}</Text>
          </View>
          
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.navBtn}>
              <Navigation color="#fff" size={20} />
              <Text style={styles.navBtnText}>Navigate</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.sosBtn} onPress={() => navigation.navigate('SOS')}>
              <AlertCircle color="#fff" size={20} />
              <Text style={styles.sosBtnText}>SOS</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating SOS if no route active */}
      {!routeData && (
        <TouchableOpacity 
          style={styles.floatingSOS}
          onPress={() => navigation.navigate('SOS')}
        >
          <Text style={styles.floatingSOSText}>SOS</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  map: { width: '100%', height: '100%' },
  searchContainer: {
    position: 'absolute', top: 50, left: 15, right: 15,
    backgroundColor: '#111', borderRadius: 8, padding: 5,
    borderWidth: 1, borderColor: '#333', elevation: 5
  },
  searchInput: { color: '#fff', padding: 10, fontSize: 16 },
  contactsScroll: {
    position: 'absolute', top: 110, left: 15, right: 15,
    flexDirection: 'row', flexWrap: 'wrap', gap: 10
  },
  contactPill: {
    backgroundColor: '#1f2937', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 20, flexDirection: 'row', itemsCenter: 'center',
    borderWidth: 1, borderColor: '#374151'
  },
  onlineDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6, alignSelf: 'center' },
  contactPillText: { color: '#e5e7eb', fontSize: 12, fontWeight: 'bold' },
  bottomSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: '#111', padding: 20,
    borderTopLeftRadius: 20, borderTopRightRadius: 20,
    borderWidth: 1, borderColor: '#333'
  },
  routeTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  routeMeta: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  routeText: { color: '#aaa', fontSize: 14 },
  actionRow: { flexDirection: 'row', gap: 15 },
  navBtn: {
    flex: 2, backgroundColor: '#2563eb', padding: 15, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  navBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  sosBtn: {
    flex: 1, backgroundColor: '#dc2626', padding: 15, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  sosBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginLeft: 8 },
  floatingSOS: {
    position: 'absolute', bottom: 30, right: 20,
    backgroundColor: '#dc2626', width: 70, height: 70, borderRadius: 35,
    justifyContent: 'center', alignItems: 'center',
    elevation: 8, shadowColor: '#dc2626', shadowOpacity: 0.5, shadowRadius: 10
  },
  floatingSOSText: { color: '#fff', fontWeight: 'bold', fontSize: 20 }
});
