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

const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 8;

const ResetPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const router = useRouter();

  // --- HANDLER FUNCTION: SIMULATE EMAIL ---
  const handleResetPassword = async () => {
    
    if (!email) {
      Alert.alert('Error', 'Please enter your email address.');
      return;
    }

    // SIMULATION: Since the backend doesn't handle actual email sending, 
    // we immediately show a success message and close the modal.
    
    Alert.alert(
      'Password Reset Requested',
      `A password reset link has been simulated and sent to ${email}. Check your inbox.`,
      [
        { text: 'OK', onPress: () => router.back() } // Navigate back to login
      ]
    );
    
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
        <Text style={styles.headerTitle}>Forgot Password</Text>
        <View style={styles.placeholderIcon}>
            <MaterialCommunityIcons name="account-circle" size={30} color={PURPLE} />
        </View>
      </View>

      {/* Reset Card Container */}
      <View style={styles.card}>
        
        <Text style={styles.instructionText}>Enter your email address to receive a password reset link:</Text>
        
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
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </TouchableOpacity>
          
        </View>
      </View>
    </SafeAreaView>
  );
};

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