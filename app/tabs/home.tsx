import React from 'react';
import { 
  SafeAreaView, 
  StyleSheet, 
  Text, 
  View, 
  Image, 
  TouchableOpacity,
  ScrollView 
} from 'react-native';
// Note: We need to import 'ViewStyle' from 'react-native' for style types, 
// though the issue is with the component props.
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
// Update the import path to correctly target the root _layout.tsx file
import { useAuth } from '../_layout'; 

const PURPLE = '#7e57c2';
const LIGHT_PURPLE = '#ede7f6';
const WHITE = '#FFFFFF';
const BORDER_RADIUS = 15;

// 1. DEFINE THE TYPE FOR A TASK
interface Task {
    id: number;
    category: string;
    name: string;
    completed: boolean;
}

// Mock data for tasks (now typed implicitly by the interface above)
const mockTasks: Task[] = [
  { id: 1, category: 'A', name: 'Get groceries', completed: false },
  { id: 2, category: 'A', name: 'Chapter 3 Quiz', completed: true },
  { id: 3, category: 'A', name: 'Read Chapter 2', completed: true },
  { id: 4, category: 'B', name: 'Call client about project status', completed: false },
  { id: 5, category: 'C', name: 'Do laundry', completed: false },
];

// 2. APPLY THE TYPE TO THE TaskItem COMPONENT PROPS
// Define the props interface for TaskItem
interface TaskItemProps {
    task: Task; // This explicitly sets the type of the 'task' prop
}

// Helper component for a single task item (now correctly typed)
const TaskItem: React.FC<TaskItemProps> = ({ task }) => (
  <View style={taskStyles.taskRow}>
    <View style={taskStyles.categoryBadge}>
      <Text style={taskStyles.categoryText}>{task.category}</Text>
    </View>
    <Text style={taskStyles.taskText}>{task.name}</Text>
    <TouchableOpacity style={taskStyles.checkbox}>
        <MaterialCommunityIcons 
            name={task.completed ? 'checkbox-marked' : 'checkbox-blank-outline'} 
            size={24} 
            color={task.completed ? PURPLE : '#bbb'} 
        />
    </TouchableOpacity>
  </View>
);

const Home = () => {
  const router = useRouter();
  const { setToken } = useAuth();

  // Simple function to log out
  const handleLogout = async () => {
    await setToken(null);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.header}>
        <View style={{ width: 30 }} /> {/* Spacer for symmetry */}
        <Text style={styles.headerTime}>9:41</Text>
        <TouchableOpacity style={styles.profileIcon} onPress={handleLogout}>
          {/* Profile icon matching the wireframe */}
          <MaterialCommunityIcons name="account-circle-outline" size={30} color={PURPLE} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeText}>welcome back!</Text>
          {/* Placeholder for the notebook image */}
          <Image
            source={{ uri: 'https://placehold.co/80x80/ede7f6/7e57c2?text=📝' }}
            style={styles.notebookImage}
          />
        </View>

        {/* Today's Tasks List */}
        <Text style={styles.tasksTitle}>today's tasks:</Text>
        <View style={styles.taskList}>
          {mockTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- STYLESHEET ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LIGHT_PURPLE,
    paddingBottom: 80, // Ensure space for the persistent tab bar
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: LIGHT_PURPLE,
  },
  headerTime: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileIcon: {
    padding: 5,
  },
  welcomeCard: {
    width: '100%',
    backgroundColor: WHITE,
    borderWidth: 1,
    borderColor: PURPLE,
    borderRadius: BORDER_RADIUS,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontStyle: 'italic',
    color: PURPLE,
    marginBottom: 10,
    fontFamily: 'Cochin', // Use a custom font if available, or a simple cursive-like style
  },
  notebookImage: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
  },
  tasksTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    alignSelf: 'flex-start',
    marginBottom: 15,
    textTransform: 'uppercase',
  },
  taskList: {
    width: '100%',
    backgroundColor: WHITE,
    borderRadius: BORDER_RADIUS,
    padding: 15,
  },
});

const taskStyles = StyleSheet.create({
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryBadge: {
    backgroundColor: LIGHT_PURPLE,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  categoryText: {
    color: PURPLE,
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  checkbox: {
    marginLeft: 10,
    padding: 5,
  },
});

export default Home;