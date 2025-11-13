import { StyleSheet, Text, View } from "react-native";
import BottomNav from "../components/BottomNav";

export default function ChatScreen() {
  return (
    <View style={styles.page}>
      <View style={{ height: 80 }} />
      <Text style={styles.placeholder}>Chat feature coming soon</Text>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fbf7ff", justifyContent: "center", alignItems: "center" },
  placeholder: { fontSize: 16, color: "#999" },
});
