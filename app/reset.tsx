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

// --- STYLING CONSTANTS (Matching LoginScreen) ---
const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 8;

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // --- HANDLER FUNCTION ---
  const handleResetPassword = async () => {
    // In a real application, this would send an email. 
    // For your CS 1200 project, we will simulate the success.
    
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    // Since our backend doesn't implement email sending, we simulate the success
    // and provide feedback to the user.
    Alert.alert(
      'Password Reset Requested',
      `A password reset link has been sent to ${email}. Check your inbox.`,
      [
        { text: 'OK', onPress: () => router.back() } // Navigate back to login
      ]
    );
    
    // Optionally, clear the input
    setEmail('');
  };

  // --- UI RENDERING ---
  return (
    <SafeAreaView style={styles.container}>
      {/* Header and Back Button (matching LoginScreen) */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={PURPLE} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reset Password</Text>
        <View style={styles.placeholderIcon}>
            <MaterialCommunityIcons name="account-circle" size={30} color={PURPLE} />
        </View>
      </View>

      {/* Reset Card Container (The pale purple box in your mockup) */}
      <View style={styles.card}>
        
        <Text style={styles.instructionText}>Enter your email address:</Text>
        
        {/* Email Input */}
        <TextInput
          style={styles.input}
          placeholder="Email Address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Action Buttons Container */}
        <View style={styles.buttonContainer}>
          
          {/* Cancel Button */}
          <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          {/* Reset Password Button */}
          <TouchableOpacity 
            style={styles.resetButton} 
            onPress={handleResetPassword}
          >
            <Text style={styles.resetButtonText}>Reset Password</Text>
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
    backgroundColor: LIGHT_PURPLE, // Assuming the header background matches the container
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)', // Subtle line
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
    width: 30, // To align the title centrally
  },
  card: {
    backgroundColor: 'rgba(196, 172, 238, 0.4)', // The pale purple box color
    margin: 20,
    padding: 20,
    borderRadius: BORDER_RADIUS * 2,
  },
  instructionText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 10,
  },
  input: {
    height: 45,
    backgroundColor: WHITE,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: BORDER_RADIUS,
    paddingHorizontal: 10,
    fontSize: 16,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 10,
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

export default ResetPasswordScreen;