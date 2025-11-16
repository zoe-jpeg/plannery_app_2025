import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { format as formatDateFn, isValid, parse } from 'date-fns';
import React, { useEffect, useState } from "react";
import {
     Alert,
     FlatList,
     Modal,
     ScrollView,
     StyleSheet,
     Text,
     TextInput,
     TouchableOpacity,
     View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomNav from "../components/BottomNav";

const STORAGE_KEY = "TASKS_V1";
const COURSES_STORAGE_KEY = "COURSES_V1";

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
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks)).catch((e) => {
      console.warn("Save tasks failed", e);
    });
  }, [tasks]);
  return [tasks, setTasks] as const;
}

function useCourses() {
  const [courses, setCourses] = useState<string[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem(COURSES_STORAGE_KEY);
        if (raw) setCourses(JSON.parse(raw));
        else setCourses(["General"]);
      } catch (e) {
        console.warn("Load courses failed", e);
        setCourses(["General"]);
      }
    })();
  }, []);
  useEffect(() => {
    AsyncStorage.setItem(COURSES_STORAGE_KEY, JSON.stringify(courses)).catch((e) => {
      console.warn("Save courses failed", e);
    });
  }, [courses]);
  return [courses, setCourses] as const;
}

export default function ChecklistScreen() {
  const [tasks, setTasks] = useTasks();
  const [courses, setCourses] = useCourses();
  const [showModal, setShowModal] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [showAddCourse, setShowAddCourse] = useState(false);
  const [sortBy, setSortBy] = useState<'none'|'date'|'course'>('none');
  const [sortDir, setSortDir] = useState<'asc'|'desc'>('asc');
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [dueDateText, setDueDateText] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [courseInput, setCourseInput] = useState("");

  const handleAddCourse = () => {
    if (!newCourse.trim()) return;
    if (!courses.includes(newCourse.trim())) {
      const added = newCourse.trim();
      setCourses([...courses, added]);
      setCourse(added);
    }
    setNewCourse("");
    setShowAddCourse(false);
  };

  const handleAddTask = () => {
    if (!title.trim()) {
      Alert.alert("Title required", "Please enter a task title.");
      return;
    }
    // resolve due date: prefer picked Date, otherwise parse typed string
    let dueISO: string | null = null;
    if (dueDate) {
      dueISO = dueDate.toISOString().split('T')[0];
    } else if (dueDateText.trim()) {
      // try parse MM/dd/yyyy
      const parsed = parse(dueDateText.trim(), 'MM/dd/yyyy', new Date());
      if (isValid(parsed)) dueISO = parsed.toISOString().split('T')[0];
      else {
        const fallback = new Date(dueDateText.trim());
        if (!isNaN(fallback.getTime())) dueISO = fallback.toISOString().split('T')[0];
        else {
          Alert.alert('Invalid date', 'Please enter a valid date (MM/DD/YYYY)');
          return;
        }
      }
    }

    const newTask = {
      id: Math.random().toString(36).slice(2),
      title: title.trim(),
      course: course || "General",
      dueDate: dueISO,
      type: "Homework",
      done: false,
    };
    setTasks([newTask, ...tasks]);
    setTitle("");
    setCourse("");
    setDueDate(null);
    setDueDateText("");
    setShowModal(false);
  };

  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  useEffect(() => {
    if (dueDate) setDueDateText(formatDateFn(dueDate, 'MM/dd/yyyy'));
    else setDueDateText('');
  }, [dueDate]);

  // compute sorted tasks according to sortBy and sortDir
  const sortedTasks = [...tasks].sort((a, b) => {
    if (sortBy === 'date') {
      const ad = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const bd = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return sortDir === 'asc' ? ad - bd : bd - ad;
    }
    if (sortBy === 'course') {
      const res = (a.course || '').localeCompare(b.course || '');
      return sortDir === 'asc' ? res : -res;
    }
    return 0;
  });

  return (
    <SafeAreaView style={styles.page} edges={["top"]}>
      <View style={styles.sortRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[styles.sortTag, sortBy === 'none' && styles.sortTagActive]}
            onPress={() => { setSortBy('none'); setSortDir('asc'); }}
          >
            <Text style={sortBy === 'none' ? styles.sortTagTextActive : styles.sortTagText}>None</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortTag, { marginLeft: 8 }, sortBy === 'date' && styles.sortTagActive]}
            onPress={() => {
              if (sortBy === 'date') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
              else { setSortBy('date'); setSortDir('asc'); }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={sortBy === 'date' ? styles.sortTagTextActive : styles.sortTagText}>Date</Text>
              {sortBy === 'date' && (
                <Ionicons name={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={14} color={sortBy === 'date' ? '#333' : '#666'} style={{ marginLeft: 6 }} />
              )}
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.sortTag, { marginLeft: 8 }, sortBy === 'course' && styles.sortTagActive]}
            onPress={() => {
              if (sortBy === 'course') setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
              else { setSortBy('course'); setSortDir('asc'); }
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={sortBy === 'course' ? styles.sortTagTextActive : styles.sortTagText}>Course</Text>
              {sortBy === 'course' && (
                <Ionicons name={sortDir === 'asc' ? 'chevron-up' : 'chevron-down'} size={14} color={sortBy === 'course' ? '#333' : '#666'} style={{ marginLeft: 6 }} />
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <FlatList
        data={sortedTasks}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120, paddingTop: 80 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => toggleTask(item.id)}
            style={styles.checklistItem}
          >
            <View style={styles.checklistItemAvatar}>
              <Text style={{ color: "#fff", fontWeight: "600" }}>{(item.course || "C")[0]}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={[styles.checklistItemText, item.done && { textDecorationLine: "line-through", color: "#999" }]}>{item.title}</Text>
              {item.dueDate && (
                <Text style={{ fontSize: 12, color: "#999", marginTop: 4 }}>Due: {new Date(item.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</Text>
              )}
            </View>
            <Ionicons name={item.done ? "checkmark-circle" : "ellipse-outline"} size={20} color="#7C3AED" />
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View style={{ padding: 24 }}>
            <Text style={{ color: "#777" }}>No tasks. Add one to get started! ✨</Text>
          </View>
        )}
      />

      <TouchableOpacity
        onPress={() => setShowModal(true)}
        style={styles.fab}
      >
        <Ionicons name="add" size={24} color="#fff" />
      </TouchableOpacity>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Describe Task</Text>

            <Text style={styles.modalLabel}>Title</Text>
            <TextInput
              style={styles.modalInput}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g. Chapter 3 Quiz"
            />

            <Text style={styles.modalLabel}>Course</Text>
            <TouchableOpacity
              onPress={() => setShowCourseDropdown(!showCourseDropdown)}
              style={[styles.modalInput, { justifyContent: "center", paddingVertical: 8 }]}
            >
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <Text style={{ color: course ? "#333" : "#999", fontWeight: "500" }}>
                  {course || "Select a course"}
                </Text>
                <Ionicons name={showCourseDropdown ? "chevron-up" : "chevron-down"} size={18} color="#7C3AED" />
              </View>
            </TouchableOpacity>

            {showCourseDropdown && (
              <View style={styles.dropdown}>
                <TextInput
                  style={[styles.modalInput, { margin: 8 }]}
                  value={courseInput}
                  onChangeText={setCourseInput}
                  placeholder="Type or pick a course"
                  autoFocus
                />
                <ScrollView style={{ maxHeight: 120 }}>
                  {courses
                    .filter((c) => c.toLowerCase().includes(courseInput.trim().toLowerCase()))
                    .map((c) => (
                      <TouchableOpacity
                        key={c}
                        onPress={() => {
                          setCourse(c);
                          setCourseInput(c);
                          setShowCourseDropdown(false);
                        }}
                        style={[styles.dropdownItem, course === c && { backgroundColor: "#E5D5F2" }]}
                      >
                        <Text style={[styles.dropdownItemText, course === c && { fontWeight: "600" }]}>{c}</Text>
                      </TouchableOpacity>
                    ))}
                </ScrollView>

                <TouchableOpacity
                  onPress={() => {
                    const name = courseInput.trim();
                    if (!name) return setShowAddCourse(true);
                    if (!courses.includes(name)) {
                      setCourses([...courses, name]);
                    }
                    setCourse(name);
                    setCourseInput("");
                    setShowCourseDropdown(false);
                  }}
                  style={styles.dropdownItem}
                >
                  <Ionicons name="add-circle" size={16} color="#7C3AED" style={{ marginRight: 8 }} />
                  <Text style={styles.dropdownItemText}>{courseInput ? `Add "${courseInput}"` : 'Add new course'}</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.modalLabel}>Due Date</Text>
            <TextInput
              style={[styles.modalInput, { marginTop: 6 }]}
              value={dueDateText}
              onChangeText={setDueDateText}
              placeholder="MM/DD/YYYY"
              keyboardType="numbers-and-punctuation"
            />

            <View style={{ flexDirection: 'row', marginTop: 12, gap: 8 }}>
              <TouchableOpacity
                onPress={() => {
                  const tomorrow = new Date();
                  tomorrow.setDate(tomorrow.getDate() + 1);
                  setDueDate(tomorrow);
                }}
                style={[styles.quickDateButton, { flex: 1 }]}
              >
                <Text style={styles.quickDateButtonText}>Tomorrow</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  const nextWeek = new Date();
                  nextWeek.setDate(nextWeek.getDate() + 7);
                  setDueDate(nextWeek);
                }}
                style={[styles.quickDateButton, { flex: 1 }]}
              >
                <Text style={styles.quickDateButtonText}>Next Week</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setDueDate(null)}
                style={[styles.quickDateButton, { flex: 1 }]}
              >
                <Text style={styles.quickDateButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: "row", gap: 12, marginTop: 24 }}>
              <TouchableOpacity onPress={handleAddTask} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.modalButtonCancel}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={showAddCourse} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modal, { maxHeight: 200 }]}>
            <Text style={styles.modalTitle}>New Course</Text>
            <TextInput
              style={styles.modalInput}
              value={newCourse}
              onChangeText={setNewCourse}
              placeholder="e.g. Biology 101"
              autoFocus
            />
            <View style={{ flexDirection: "row", gap: 12, marginTop: 16 }}>
              <TouchableOpacity onPress={handleAddCourse} style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Add</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAddCourse(false)} style={styles.modalButtonCancel}>
                <Text style={styles.modalButtonCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#fbf7ff" },
  sortRow: { paddingHorizontal: 20, paddingVertical: 8, marginTop: 8 },
  sortTag: { padding: 8, backgroundColor: "#f2efff", borderRadius: 20, marginRight: 8 },
  sortTagActive: { backgroundColor: "#d7ccff" },
  sortTagText: { fontSize: 14, color: "#666" },
  sortTagTextActive: { fontSize: 14, color: "#333", fontWeight: "600" },
  checklistItem: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5D5F2",
  },
  checklistItemAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#D6BFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  checklistItemText: { flex: 1, fontWeight: "500", color: "#333" },
  fab: { position: "absolute", bottom: 120, right: 20, width: 56, height: 56, borderRadius: 28, backgroundColor: "#7C3AED", alignItems: "center", justifyContent: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modal: { backgroundColor: "#fff", borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40, maxHeight: "80%" },
  modalTitle: { fontSize: 20, fontWeight: "700", color: "#000", marginBottom: 20 },
  modalLabel: { fontSize: 14, fontWeight: "600", color: "#333", marginTop: 12, marginBottom: 6 },
  modalInput: { backgroundColor: "#f5f5f5", padding: 12, borderRadius: 10, fontSize: 14, borderWidth: 1, borderColor: "#E5D5F2" },
  dropdown: { backgroundColor: "#f5f5f5", borderRadius: 10, borderWidth: 1, borderColor: "#E5D5F2", marginTop: 4, maxHeight: 150 },
  dropdownItem: { padding: 12, borderBottomWidth: 1, borderBottomColor: "#E5D5F2", flexDirection: "row", alignItems: "center" },
  dropdownItemText: { fontSize: 14, color: "#333", flex: 1 },
  datePickerContainer: { backgroundColor: "#f5f5f5", borderRadius: 10, padding: 12, marginTop: 8, gap: 8 },
  quickDateButton: { backgroundColor: "#E5D5F2", padding: 10, borderRadius: 8, alignItems: "center" },
  quickDateButtonText: { fontSize: 14, color: "#333", fontWeight: "500" },
  modalButton: { flex: 1, backgroundColor: "#7C3AED", padding: 12, borderRadius: 10, alignItems: "center" },
  modalButtonText: { color: "#fff", fontWeight: "600" },
  modalButtonCancel: { flex: 1, backgroundColor: "#E5D5F2", padding: 12, borderRadius: 10, alignItems: "center" },
  modalButtonCancelText: { color: "#333", fontWeight: "600" },
});
