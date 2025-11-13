import { Stack } from "expo-router";

export default function TabsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="checklist" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="chat" />
      <Stack.Screen name="settings" />
    </Stack>
  );
}
