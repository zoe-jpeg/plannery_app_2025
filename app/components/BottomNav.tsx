import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

export default function BottomNav() {
  const router = useRouter();

  const navItems = [
    { route: "index", icon: "star", label: "Home" },
    { route: "checklist", icon: "list", label: "Checklist" },
    { route: "calendar", icon: "calendar", label: "Calendar" },
    { route: "chat", icon: "chatbubble", label: "Chat" },
    { route: "settings", icon: "settings", label: "Settings" },
  ];

  const handleNavPress = (route: string) => {
    if (route === "index") {
      router.push("/(tabs)");
    } else if (route === "checklist") {
      router.push("/(tabs)/checklist");
    } else if (route === "calendar") {
      router.push("/(tabs)/calendar");
    } else if (route === "chat") {
      router.push("/(tabs)/chat");
    } else if (route === "settings") {
      router.push("/(tabs)/settings");
    }
  };

  return (
    <View style={styles.bottomNav}>
      {navItems.map((item) => (
        <TouchableOpacity
          key={item.route}
          style={styles.navItem}
          onPress={() => handleNavPress(item.route)}
        >
          <Ionicons name={item.icon as any} size={22} color="#231f20" />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    position: "absolute",
    bottom: 16,
    left: 12,
    right: 12,
    height: 68,
    backgroundColor: "#dcd5ff",
    borderRadius: 32,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  navItem: { flex: 1, alignItems: "center", justifyContent: "center" },
});
