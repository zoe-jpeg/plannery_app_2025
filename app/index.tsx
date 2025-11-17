import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Alert, 
  SafeAreaView, 
  Platform 
} from 'react-native';
import { useAuth } from './_layout';
import { Link, useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { API_URL } from '@env';

console.log("API URL:", API_URL);

const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 15;

export default function IndexScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const router = useRouter();
  const { setToken } = useAuth(); // Gets the function to save the token and trigger re-render

  const handleSignIn = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        // --- CRITICAL STEP: SAVE TOKEN ---
        await setToken(data.token); 
        
        // The setToken function inside AuthProvider in _layout.tsx
        // updates the global 'token' state, which automatically
        // triggers the router logic to redirect to the (tabs) group.
        // We do NOT need router.replace('/(tabs)/home'); here.
        
      } else {
        // Check for specific error message from backend
        const message = data.message || 'An unknown error occurred.';
        Alert.alert('Login Failed', message);
      }
    } catch (error) {
      console.error('Network or Login Error:', error);
      Alert.alert('Login Error', 'Could not connect to the server or process the request.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header (Simplified) */}
        <View style={styles.header}>
          <Text style={styles.title}>Login</Text>
          <MaterialCommunityIcons name="account-circle" size={30} color={PURPLE} />
        </View>

        <View style={styles.card}>
          {/* Username/Email Input */}
          <Text style={styles.label}>Email (Username)</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter your username"
            autoCapitalize="none"
          />

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity 
              style={styles.eyeButton} 
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <MaterialCommunityIcons 
                name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} 
                size={24} 
                color="#666" 
              />
            </TouchableOpacity>
          </View>
          
          <Link href="/reset" asChild>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </Link>

          <TouchableOpacity style={styles.button} onPress={handleSignIn}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>
          
          <Text style={styles.signUpText}>
             Don't have an account? 
             <Link href="/register" style={styles.signUpLink} asChild>
                <Text style={styles.signUpLink}> Sign Up</Text>
             </Link>
          </Text>
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
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center', // Center content vertically
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: PURPLE,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    marginTop: 15,
    color: PURPLE,
    fontWeight: '600',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    height: 50,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 15,
    fontSize: 16,
    height: '100%',
  },
  eyeButton: {
    padding: 10,
  },
  forgotPassword: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginBottom: 20,
    color: PURPLE,
    textDecorationLine: 'underline',
    fontSize: 14,
  },
  button: {
    backgroundColor: PURPLE,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: WHITE,
    fontSize: 18,
    fontWeight: 'bold',
  },
  signUpText: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
  },
  signUpLink: {
    color: PURPLE,
    fontWeight: 'bold',
  }
});