import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- STYLING CONSTANTS ---
const PURPLE = '#7e57c2'; // Main accent color
const LIGHT_PURPLE = '#ede7f6'; // Background color
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 8;

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // --- API CALL FUNCTION ---
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    // NOTE: If running on a real device/emulator, replace 'localhost' with your 
    // computer's local IP address (e.g., 'http://192.168.x.x:3000')
    const API_URL = 'http://10.162.174.1:3000/auth/login';

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Backend expects 'username' (which we use the email for) and 'password'
        body: JSON.stringify({ username: email, password: password }),
      });
      
      const data = await response.json();

      if (response.ok) {
        console.log('Login Successful! Token:', data.token);
        Alert.alert('Success', 'Logged in successfully!');
        
        // TODO: Store token securely and navigate to the main app screen
        // router.replace('/'); 
        
      } else {
        // Display backend error message
        Alert.alert('Login Failed', data.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Network Error:', error);
      Alert.alert('Error', 'Could not connect to the server. Check if the API is running.');
    }
  };

  // --- UI RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header (Back button, Title, User Icon) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={PURPLE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        <View style={styles.placeholderIcon}>
            <MaterialCommunityIcons name="account-circle" size={30} color={PURPLE} />
        </View>
      </View>

      {/* Login Card Container */}
      <View style={styles.card}>
        
        {/* Email Input */}
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Value"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Value"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity 
            style={styles.eyeIcon} 
            onPress={() => setShowPassword(!showPassword)}
          >
            <MaterialCommunityIcons 
              name={showPassword ? 'eye-off' : 'eye'} 
              size={24} 
              color="#666" 
            />
          </TouchableOpacity>
        </View>

        {/* Sign In Button */}
        <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
          <Text style={styles.signInButtonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Forgot Password Link */}
        // login.tsx

// ... (inside the Forgot Password TouchableOpacity)

<TouchableOpacity onPress={() => router.push('./reset')}>
    <Text style={styles.forgotPasswordText}>
        Forgot password?
    </Text>
</TouchableOpacity>
        
      </View>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_PURPLE,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: LIGHT_PURPLE,
    borderBottomWidth: 1,
    borderBottomColor: PURPLE,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PURPLE,
  },
  placeholderIcon: {
    width: 30, 
  },
  card: {
    backgroundColor: WHITE,
    margin: 20,
    padding: 20,
    borderRadius: BORDER_RADIUS,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 10,
    backgroundColor: WHITE,
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    backgroundColor: WHITE,
    fontSize: 16,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  eyeIcon: {
    padding: 10,
  },
  signInButton: {
    backgroundColor: PURPLE,
    padding: 15,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 15,
  },
  signInButtonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPasswordText: {
    color: PURPLE,
    fontSize: 14,
    textAlign: 'left',
    paddingLeft: 5,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;