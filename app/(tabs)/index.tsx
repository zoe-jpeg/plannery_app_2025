import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import BottomNav from "../components/BottomNav";

const STORAGE_KEY = "TASKS_V1";

function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(STORAGE_KEY);
        if (raw) setTasks(JSON.parse(raw));
      } catch (e) {
        console.warn("Load tasks failed", e);
      }
    })();
  }, []);
  return tasks;
}

export default function HomeScreen() {
  const tasks = useTasks();
  const todaysTasks = tasks.slice(0, 3);

  return (
    <View style={styles.page}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100, padding: 24, paddingTop: 80 }} showsVerticalScrollIndicator={false}>
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>welcome back!</Text>
          <View style={{ height: 12 }} />
          <Text style={styles.welcomeIcon}>📝</Text>
        </View>

        <Text style={styles.sectionTitle}>today&apos;s tasks:</Text>
        {todaysTasks.length > 0 ? (
          todaysTasks.map((task: any) => (
            <View key={task.id} style={styles.taskItem}>
              <View style={styles.taskAvatar}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>{(task.course || "C")[0]}</Text>
              </View>
              <Text style={styles.taskItemText}>{task.title}</Text>
              <Ionicons name="checkmark-circle" size={20} color="#7C3AED" style={{ marginLeft: "auto" }} />
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No tasks today!</Text>
        )}
      </ScrollView>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fbf7ff" },
  welcomeCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#d6cfff",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  welcomeText: { fontSize: 22, fontStyle: "italic", fontWeight: "500" },
  welcomeIcon: { fontSize: 48 },
  sectionTitle: { fontSize: 16, fontWeight: "500", color: "#333", marginBottom: 12 },
  taskItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5D5F2",
  },
  taskAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D6BFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  taskItemText: { marginLeft: 12, flex: 1, fontWeight: "500", color: "#333" },
  emptyText: { color: "#999", textAlign: "center", marginVertical: 20 },
});
