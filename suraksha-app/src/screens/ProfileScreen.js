import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import { AuthContext } from '../context/AuthContext';
import { LogOut, Shield } from 'lucide-react-native';

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);
  const [shareLoc, setShareLoc] = useState(true);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{user?.name?.charAt(0) || 'U'}</Text>
        </View>
        <Text style={styles.name}>{user?.name}</Text>
        <Text style={styles.phone}>{user?.phone} · {user?.cityName}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Safety Settings</Text>
        
        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Share Live Location</Text>
            <Text style={styles.settingSub}>When navigating safe routes</Text>
          </View>
          <Switch 
            value={shareLoc}
            onValueChange={setShareLoc}
            trackColor={{ false: '#333', true: '#10b981' }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity style={styles.pinBtn}>
          <Shield color="#8b5cf6" size={20} />
          <Text style={styles.pinBtnText}>Setup Emergency PIN (To cancel SOS)</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <LogOut color="#ef4444" size={20} />
        <Text style={styles.logoutBtnText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { alignItems: 'center', marginVertical: 30 },
  avatar: {
    width: 80, height: 80, borderRadius: 40, backgroundColor: '#1f2937',
    justifyContent: 'center', alignItems: 'center', marginBottom: 15,
    borderWidth: 2, borderColor: '#ef4444'
  },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  name: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  phone: { color: '#888', fontSize: 16, marginTop: 5 },
  section: { backgroundColor: '#111', borderRadius: 12, padding: 15, borderWidth: 1, borderColor: '#333' },
  sectionTitle: { color: '#fff', fontWeight: 'bold', fontSize: 16, marginBottom: 15 },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  settingLabel: { color: '#fff', fontSize: 16 },
  settingSub: { color: '#666', fontSize: 12, marginTop: 2 },
  pinBtn: {
    backgroundColor: '#2e1065', padding: 15, borderRadius: 8,
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#4c1d95'
  },
  pinBtnText: { color: '#c4b5fd', fontWeight: 'bold', marginLeft: 10 },
  logoutBtn: {
    marginTop: 'auto', backgroundColor: '#450a0a', padding: 15, borderRadius: 8,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#7f1d1d'
  },
  logoutBtnText: { color: '#fca5a5', fontWeight: 'bold', fontSize: 16, marginLeft: 10 }
});
