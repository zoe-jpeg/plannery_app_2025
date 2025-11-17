import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from './_layout';
import { API_URL } from '@env';
console.log("API URL:", API_URL);

// --- STYLING CONSTANTS (Matching LoginScreen) ---
const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 8;

const ChangePasswordScreen = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const router = useRouter();
  // Get token and setToken from Auth Context
  const { token, setToken } = useAuth(); 

  // --- HANDLER FUNCTION ---
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in both password fields.');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }
    
    
    if (!token) {
        Alert.alert('Error', 'Authentication required. Please log in again.');
        setToken(null);
        return;
    }

    

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                // 🚨 CRITICAL: Attach the JWT token for the protected route
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ newPassword }),
        });

        const data = await response.json();

        if (response.ok) {
            // Log the user out after a successful password change for security
            await setToken(null); 
            Alert.alert(
                'Success', 
                'Password updated successfully! Please log in with your new password.',
                [{ text: 'OK', onPress: () => router.replace('/') }] // Go to login screen
            );
        } else {
            // Handle cases where the token is bad or server rejects the password
            Alert.alert('Update Failed', data.message || 'An unknown error occurred.');
        }

    } catch (error) {
        console.error('Network Error:', error);
        Alert.alert('Error', 'Could not connect to the server or network error.');
    }
  };

  // --- UI RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header and Back Button (matching LoginScreen) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={PURPLE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Change Password</Text>
        <View style={styles.placeholderIcon}>
            <MaterialCommunityIcons name="account-circle" size={30} color={PURPLE} />
        </View>
      </View>

      {/* Card Container */}
      <View style={styles.card}>
        
        <Text style={styles.instructionText}>Enter your new password:</Text>
        
        {/* New Password Input */}
        <TextInput
          style={styles.input}
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={true}
        />
        
        {/* Confirm Password Input */}
        <Text style={styles.instructionText}>Confirm new password:</Text>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
        />

        {/* Action Buttons Container */}
        <View style={styles.buttonContainer}>
          
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Change Password Button */}
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleChangePassword}
          >
            <Text style={styles.resetButtonText}>Change Password</Text>
          </TouchableOpacity>
          
        </View>
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
    borderBottomColor: 'rgba(0,0,0,0.1)',
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
    backgroundColor: 'rgba(196, 172, 238, 0.4)',
    margin: 20,
    padding: 20,
    borderRadius: BORDER_RADIUS * 2,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
    marginTop: 15,
  },
  input: {
    height: 45,
    backgroundColor: WHITE,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 20,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  cancelButtonText: {
    color: PURPLE,
    fontSize: 16,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: PURPLE,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: BORDER_RADIUS,
    alignItems: 'center',
  },
  resetButtonText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;