import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Link, useRouter } from 'expo-router';
import { useAuth } from './_layout';

const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 15;

import { API_URL } from '@env';

export default function RegisterScreen() {
  // 1. STATE DEFINITIONS (Fixes "Cannot find name 'username', 'password', etc.")
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  // 2. HOOKS (Fixes "Cannot find name 'setToken'")
  const router = useRouter();
  const { setToken } = useAuth(); 

  // 3. REGISTRATION HANDLER (Includes robust network logging)
  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter a username and password.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      // Attempt to parse JSON response
      const data = await response.json();

      if (response.ok && data.token) {
        // Successful registration
        await setToken(data.token); 
        Alert.alert('Success', 'Account created and logged in!');
        router.replace('/');
      } else {
        // Handle server-side errors 
        const message = data.message || 'Registration failed due to an unknown server error.';
        Alert.alert('Registration Failed', message);
        console.log('Server Error Details:', data); 
      }
    } catch (error) {
      console.error('NETWORK CONNECTION FAILURE:', error);
      Alert.alert('Connection Error', 'Could not reach the server. Please check your API URL and ensure the Node.js server is running.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.header}>Sign Up</Text>
        
        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Choose Username"
          placeholderTextColor="#999"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

        {/* Password Input */}
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.passwordInput}
            placeholder="Choose Password"
            placeholderTextColor="#999"
            secureTextEntry={!isPasswordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          >
            <MaterialCommunityIcons 
              name={isPasswordVisible ? 'eye-off' : 'eye'} 
              size={24} 
              color={PURPLE} 
            />
          </TouchableOpacity>
        </View>

        {/* Register Button */}
        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        {/* Sign In Link */}
        <View style={styles.signupTextContainer}>
          <Text style={styles.signupText}>
            Already have an account? 
          </Text>
          <Link href="/" style={styles.signupLink} asChild>
            <TouchableOpacity>
              <Text style={styles.signupLinkText}>Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: LIGHT_PURPLE,
  },
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: WHITE,
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 50,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: PURPLE,
    marginBottom: 40,
  },
  input: {
    width: '100%',
    padding: 16,
    borderWidth: 1,
    borderColor: LIGHT_PURPLE,
    borderRadius: BORDER_RADIUS,
    marginBottom: 20,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    borderColor: LIGHT_PURPLE,
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    marginBottom: 30,
    backgroundColor: '#fff',
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
  },
  toggleButton: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    backgroundColor: PURPLE,
    padding: 18,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupTextContainer: {
    flexDirection: 'row',
    marginTop: 10,
  },
  signupText: {
    fontSize: 14,
    color: '#666',
  },
  signupLink: {
    marginLeft: 5,
  },
  signupLinkText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: PURPLE,
    textDecorationLine: 'underline',
  }
});