import { Redirect, Stack } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';

// 1. Create the Authentication Context
type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// 2. Auth Provider to load and manage the token
function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token from secure storage on app startup
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        setToken(storedToken);
      } catch (e) {
        console.error('Failed to load token:', e);
      } finally {
        setIsLoading(false);
      }
    };
    loadToken();
  }, []);

  const saveToken = async (newToken: string | null) => {
    setToken(newToken);
    if (newToken) {
      await SecureStore.setItemAsync('userToken', newToken);
    } else {
      await SecureStore.deleteItemAsync('userToken');
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken: saveToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Root Layout (Router logic)
export default function RootLayout() {
  return (
    <AuthProvider>
      <AppStack />
    </AuthProvider>
  );
}

function AppStack() {
  const { token, isLoading } = useAuth();
  
  if (isLoading) {
      // You might show a loading spinner here
      return <Stack><Stack.Screen name="index" options={{ headerShown: false }} /></Stack>;
  }

  return (
    <Stack>
      {/* If token exists, redirect away from login/reset */}
      {token ? (
        <>
          <Stack.Screen name="home" options={{ title: "Home" }} /> 
          {/* This is the new change-password screen for LOGGED-IN users */}
          <Stack.Screen name="change-password" options={{ headerShown: false, presentation: 'modal' }} />
        </>
      ) : (
        // If no token, only allow access to login/reset screens
        <>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          {/* This screen now simulates "Forgot Password" functionality for LOGGED-OUT users */}
          <Stack.Screen name="reset" options={{ headerShown: false, presentation: 'modal' }} />
          {/* Redirect attempts to 'home' back to 'index' */}
          <Stack.Screen name="home" options={{ headerTitle: () => <Redirect href="/" /> }} />
        </>
      )}
    </Stack>
  );
}
