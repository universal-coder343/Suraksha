import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { UserMinus, Plus } from 'lucide-react-native';
import { getContacts, addContact, deleteContact } from '../services/api';

export default function ContactsScreen() {
  const [contacts, setContacts] = useState([]);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relation, setRelation] = useState('Friend');

  const loadContacts = async () => {
    try {
      const res = await getContacts();
      setContacts(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const handleAdd = async () => {
    if (!name || !phone) return;
    try {
      await addContact({ name, phone, relationship: relation });
      setName('');
      setPhone('');
      loadContacts();
    } catch (e) {
      Alert.alert('Error', e.response?.data?.message || 'Could not add');
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteContact(id);
      loadContacts();
    } catch (e) {
      Alert.alert('Error', 'Could not delete');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{item.name.charAt(0)}</Text>
        </View>
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.phone}>{item.phone} · {item.relationship}</Text>
        </View>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item._id)} style={styles.delBtn}>
        <UserMinus color="#ef4444" size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Trusted Contacts</Text>
      <Text style={styles.subHeader}>Alerted automatically during SOS</Text>

      <FlatList
        data={contacts}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        style={styles.list}
      />

      {contacts.length < 5 && (
        <View style={styles.form}>
          <Text style={styles.formTitle}>Add New Contact</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone Number"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
          {/* Simple toggle for relation instead of dropdown for brevity */}
          <View style={styles.row}>
            {['Mom', 'Sister', 'Friend'].map(r => (
              <TouchableOpacity 
                key={r}
                style={[styles.chip, relation === r && styles.chipActive]}
                onPress={() => setRelation(r)}
              >
                <Text style={styles.chipText}>{r}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
            <Plus color="#fff" size={20} />
            <Text style={styles.addBtnText}>Add Contact</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000', padding: 20 },
  header: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subHeader: { color: '#888', marginBottom: 20 },
  list: { flex: 1 },
  card: {
    backgroundColor: '#111', padding: 15, borderRadius: 10,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: '#333', marginBottom: 10
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: '#374151',
    justifyContent: 'center', alignItems: 'center', marginRight: 15
  },
  avatarText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  name: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  phone: { color: '#aaa', fontSize: 12, marginTop: 2 },
  delBtn: { padding: 10, backgroundColor: '#450a0a', borderRadius: 8 },
  form: { backgroundColor: '#111', padding: 15, borderRadius: 12, borderWidth: 1, borderColor: '#333' },
  formTitle: { color: '#fff', fontWeight: 'bold', marginBottom: 15 },
  input: {
    backgroundColor: '#222', color: '#fff', padding: 12,
    borderRadius: 8, borderWidth: 1, borderColor: '#444', marginBottom: 10
  },
  row: { flexDirection: 'row', gap: 10, marginBottom: 15 },
  chip: { padding: 8, backgroundColor: '#222', borderRadius: 20, borderWidth: 1, borderColor: '#444' },
  chipActive: { borderColor: '#ef4444', backgroundColor: '#450a0a' },
  chipText: { color: '#fff', fontSize: 12 },
  addBtn: {
    backgroundColor: '#2563eb', padding: 15, borderRadius: 8,
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center'
  },
  addBtnText: { color: '#fff', fontWeight: 'bold', marginLeft: 8 }
});
