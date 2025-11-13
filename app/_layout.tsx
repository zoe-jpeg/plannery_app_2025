// app/_layout.tsx

import { Redirect, Stack } from 'expo-router';
import React from 'react';

const isUserAuthenticated = false; // Keep false for testing

export default function RootLayout() {
  
  if (!isUserAuthenticated) {
    return (
      <Stack>
        {/* The Login Screen is now named index.tsx and will load by default */}
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="reset" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    );
  }

  // If the user IS authenticated, send them to the protected area.
  return (
    <Stack>
      <Stack.Screen name="home" options={{ title: "Home" }} /> 
    </Stack>
  );
}