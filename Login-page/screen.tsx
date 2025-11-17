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
import Icon from 'react-native-vector-icons/Ionicons'; 

// --- 1. Type Definitions ---
interface FormErrors {
  email?: string;
  password?: string;
}

// --- 2. Validation Logic ---
const validate = (email: string, password: string): FormErrors => {
  const errors: FormErrors = {};

  // Email Validation
  if (!email) {
    errors.email = 'Email is required.';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Invalid email format.';
  }

  // Password Validation
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
};

// --- 3. Login Component ---
const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = () => {
    const newErrors = validate(email, password);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      
      Alert.alert('Success', `Logging in with Email: ${email}`);
      // Navigates to the next screen upon successful login
    } else {
      
      Alert.alert('Login Failed', 'Please correct the errors in the form.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => console.log('Go Back')}>
          <Icon name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Login</Text>
        <TouchableOpacity onPress={() => console.log('Profile')}>
          <Icon name="person-circle" size={32} color="#8a2be2" />
        </TouchableOpacity>
      </View>

      <View style={styles.container}>
        <View style={styles.formCard}>
          {/* Email Input */}
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[
              styles.input, 
              styles.passwordInput, 
              ...(errors.email ? [styles.inputError] : [])
            ]}
            placeholder="Value"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          {/* Password Input */}
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              
              style={[
                styles.input, 
                styles.passwordInput, 
                ...(errors.password ? [styles.inputError] : [])
              ]}
              placeholder="Value"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            {/* ... eye icon and error text below ... */}
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={24} color="#000" />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          {/* Sign In Button */}
          <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          {/* Forgot Password Link */}
          <TouchableOpacity onPress={() => console.log('Forgot Password')}>
            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

// --- 4. Styling ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f5f5ff', // Light purple background for the header
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0f8',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  formCard: {
    width: '100%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginTop: 15,
    fontWeight: '500',
    color: '#333',
  },
  input: {
    height: 48,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: 'red', 
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  passwordInput: {
    flex: 1,
    paddingRight: 50, 
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
    padding: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 5,
  },
  signInButton: {
    backgroundColor: '#6a5acd', 
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#6a5acd',
    fontSize: 14,
    alignSelf: 'flex-start',
    marginTop: 10,
  },
});

export default LoginScreen;