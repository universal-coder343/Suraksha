import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';
import { useSOS } from '../hooks/useSOS';

export default function SOSScreen({ navigation }) {
  const { activeSOS, loading, activate, cancel } = useSOS();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Trigger SOS immediately on mount if not active
    if (!activeSOS && !loading) {
      activate('manual');
    }

    // Start pulsing animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.5,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true
        })
      ])
    ).start();
  }, []);

  const handleCancel = async () => {
    await cancel();
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <View style={styles.center}>
        <Animated.View style={[styles.pulseCircle, { transform: [{ scale: pulseAnim }] }]} />
        <View style={styles.sosCircle}>
          <Text style={styles.sosText}>SOS</Text>
        </View>
      </View>

      <View style={styles.statusBox}>
        <Text style={styles.statusText}>
          {loading ? 'Triggering Alert...' : 'Alert sent · Sharing live location'}
        </Text>
      </View>

      {activeSOS && (
        <View style={styles.infoCard}>
          <Text style={styles.infoLabel}>TRIGGER METHOD:</Text>
          <Text style={styles.infoValue}>{activeSOS.triggerMethod.toUpperCase()}</Text>
          
          <Text style={styles.infoLabel}>LOCATION:</Text>
          <Text style={styles.infoValue}>{activeSOS.location.lat.toFixed(4)}, {activeSOS.location.lng.toFixed(4)}</Text>

          <Text style={styles.infoLabel}>NEAREST POLICE:</Text>
          <Text style={styles.infoValue}>{activeSOS.nearestPoliceStation?.name || 'Locating...'}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
        <Text style={styles.cancelBtnText}>CANCEL SOS</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, backgroundColor: '#1a0a0a',
    alignItems: 'center', paddingTop: 100, paddingHorizontal: 20
  },
  center: {
    position: 'relative', width: 200, height: 200,
    justifyContent: 'center', alignItems: 'center', marginBottom: 50
  },
  pulseCircle: {
    position: 'absolute', width: 140, height: 140,
    borderRadius: 70, backgroundColor: 'rgba(220,38,38,0.3)',
  },
  sosCircle: {
    width: 140, height: 140, borderRadius: 70,
    backgroundColor: '#dc2626', justifyContent: 'center', alignItems: 'center',
    shadowColor: '#dc2626', shadowOpacity: 0.8, shadowRadius: 20, elevation: 10
  },
  sosText: { color: '#fff', fontSize: 40, fontWeight: 'bold' },
  statusBox: {
    backgroundColor: '#450a0a', paddingHorizontal: 20, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#7f1d1d', marginBottom: 30
  },
  statusText: { color: '#fca5a5', fontWeight: 'bold', fontSize: 16 },
  infoCard: {
    width: '100%', backgroundColor: '#111', padding: 20,
    borderRadius: 12, borderWidth: 1, borderColor: '#333', marginBottom: 40
  },
  infoLabel: { color: '#666', fontSize: 12, fontWeight: 'bold', marginTop: 10 },
  infoValue: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginTop: 2 },
  cancelBtn: {
    backgroundColor: '#333', padding: 15, borderRadius: 8, width: '100%', alignItems: 'center'
  },
  cancelBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 1 }
});
