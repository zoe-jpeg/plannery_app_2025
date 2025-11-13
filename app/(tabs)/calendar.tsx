import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import BottomNav from "../components/BottomNav";

const STORAGE_KEY = "TASKS_V1";

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export default function CalendarScreen() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [current, setCurrent] = useState(new Date());
  const [selectedDateTasks, setSelectedDateTasks] = useState<any[] | null>(null);
  const [showDayModal, setShowDayModal] = useState(false);

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

  const monthStartDay = startOfMonth(current).getDay(); // 0-6 (Sun-Sat)
  const totalDays = daysInMonth(current);

  const cells: ({ day: number; dateISO: string } | null)[] = [];
  // prepend blanks
  for (let i = 0; i < monthStartDay; i++) cells.push(null);
  for (let d = 1; d <= totalDays; d++) {
    const dt = new Date(current.getFullYear(), current.getMonth(), d);
    cells.push({ day: d, dateISO: dt.toISOString().split("T")[0] });
  }

  const tasksForDate = (dateISO: string) => tasks.filter((t) => t.dueDate === dateISO);

  return (
    <View style={styles.page}>
      <View style={{ height: 80 }} />

      <View style={styles.headerRow}>
        <TouchableOpacity onPress={() => setCurrent(new Date(current.getFullYear(), current.getMonth() - 1, 1))}>
          <Text style={styles.navText}>{'‹'}</Text>
        </TouchableOpacity>
        <Text style={styles.monthTitle}>{current.toLocaleString('default', { month: 'long', year: 'numeric' })}</Text>
        <TouchableOpacity onPress={() => setCurrent(new Date(current.getFullYear(), current.getMonth() + 1, 1))}>
          <Text style={styles.navText}>{'›'}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.weekRow}>
        {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map((w) => (
          <Text key={w} style={styles.weekDay}>{w}</Text>
        ))}
      </View>

      <View style={styles.grid}>
        {cells.map((cell, idx) => (
          <TouchableOpacity
            key={idx}
            style={styles.cell}
            onPress={() => {
              if (!cell) return;
              const t = tasksForDate(cell.dateISO);
              setSelectedDateTasks(t);
              setShowDayModal(true);
            }}
            activeOpacity={cell ? 0.7 : 1}
          >
            {cell ? (
              <>
                <Text style={styles.cellDay}>{cell.day}</Text>
                {tasksForDate(cell.dateISO).length > 0 && (
                  <View style={styles.dotRow}>
                    <View style={styles.dot} />
                    <Text style={styles.dotCount}>{tasksForDate(cell.dateISO).length}</Text>
                  </View>
                )}
              </>
            ) : null}
          </TouchableOpacity>
        ))}
      </View>

      <Modal visible={showDayModal} transparent animationType="slide">
        <View style={styles.modalBackdrop}>
          <View style={styles.dayModal}>
            <Text style={styles.modalTitle}>Tasks</Text>
            <ScrollView>
              {selectedDateTasks && selectedDateTasks.length > 0 ? (
                selectedDateTasks.map((t) => (
                  <View key={t.id} style={styles.dayTask}>
                    <Text style={{ fontWeight: '600' }}>{t.title}</Text>
                    <Text style={{ color: '#666' }}>{t.course}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#777' }}>No tasks for this day.</Text>
              )}
            </ScrollView>
            <TouchableOpacity onPress={() => setShowDayModal(false)} style={styles.closeButton}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: '#fbf7ff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, marginBottom: 8 },
  monthTitle: { fontSize: 18, fontWeight: '700' },
  navText: { fontSize: 22, color: '#7C3AED', paddingHorizontal: 12 },
  weekRow: { flexDirection: 'row', paddingHorizontal: 8, justifyContent: 'space-between' },
  weekDay: { width: `${100/7}%`, textAlign: 'center', color: '#666', fontSize: 12 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', padding: 8 },
  cell: { width: `${100/7}%`, height: 80, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 8 },
  cellDay: { fontSize: 14, color: '#333' },
  dotRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#7C3AED', marginRight: 6 },
  dotCount: { fontSize: 12, color: '#7C3AED' },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  dayModal: { backgroundColor: '#fff', padding: 20, borderTopLeftRadius: 16, borderTopRightRadius: 16, maxHeight: '60%' },
  modalTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  dayTask: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  closeButton: { marginTop: 12, backgroundColor: '#7C3AED', padding: 12, borderRadius: 10, alignItems: 'center' },
});
