import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { AuthContext } from '../context/AuthContext';

export default function LoginScreen() {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!phone || !password) {
      Alert.alert('Error', 'Please enter both phone and password');
      return;
    }

    setLoading(true);
    try {
      await login(phone, password);
    } catch (e) {
      Alert.alert('Login Failed', e.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SURAKSHA</Text>
      <Text style={styles.subtitle}>Women's Safety App</Text>

      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          placeholderTextColor="#888"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Login</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a0a0a',
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#ef4444',
    textAlign: 'center',
    letterSpacing: 2
  },
  subtitle: {
    fontSize: 16,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 50
  },
  form: {
    gap: 15
  },
  input: {
    backgroundColor: '#222',
    color: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 16
  },
  button: {
    backgroundColor: '#ef4444',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18
  }
});
