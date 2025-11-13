import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
     Alert,
     ScrollView,
     StyleSheet,
     Text,
     TouchableOpacity,
     View,
} from "react-native";
import BottomNav from "../components/BottomNav";

const settingsItems = [
  { id: "profile", icon: "person", label: "Profile" },
  { id: "notifications", icon: "notifications", label: "Notifications" },
  { id: "privacy", icon: "lock-closed", label: "Privacy & Security" },
  { id: "theme", icon: "palette", label: "Appearance/Theme" },
  { id: "help", icon: "help-circle", label: "Help & Support" },
  { id: "about", icon: "information-circle", label: "About" },
  { id: "logout", icon: "log-out", label: "Log out" },
];

export default function SettingsScreen() {
  const handleSettingPress = (id: string) => {
    if (id === "logout") {
      Alert.alert("Log out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Log out", style: "destructive", onPress: () => {} },
      ]);
    }
  };

  return (
    <View style={styles.page}>
      <ScrollView style={[styles.settingsContent, { paddingTop: 80 }]} showsVerticalScrollIndicator={false}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            onPress={() => handleSettingPress(item.id)}
            style={styles.settingsItem}
          >
            <View style={styles.settingsItemIcon}>
              <Ionicons
                name={item.icon as any}
                size={24}
                color={item.id === "logout" ? "#B91C1C" : "#7C3AED"}
              />
            </View>
            <Text style={[styles.settingsItemText, item.id === "logout" && { color: "#B91C1C" }]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fbf7ff" },
  settingsContent: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  settingsItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5D5F2",
  },
  settingsItemIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: "#E5D5F2", alignItems: "center", justifyContent: "center" },
  settingsItemText: { marginLeft: 16, fontSize: 16, fontWeight: "500", color: "#333" },
});
