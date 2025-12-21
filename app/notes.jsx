import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import NoteEditor from '../components/NoteEditor';
import { useData } from '../context/DataContext';

export default function NotesPage() {
  const { notes, addNote, editNote, deleteNote } = useData();
  const [selectedNote, setSelectedNote] = useState(null);
  const [showEditor, setShowEditor] = useState(false);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Notes</Text>
        <TouchableOpacity
          onPress={() => {
            setSelectedNote(null);
            setShowEditor(true);
          }}
        >
          <FontAwesome name='plus' size={22} color='white' />
        </TouchableOpacity>
      </View>
      {/* Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push('/')}
      >
        <FontAwesome name='home' size={24} color='white' />
      </TouchableOpacity>

      {/* Notes List */}
      <FlatList
        data={notes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.noteItem}
            onPress={() => {
              setSelectedNote(item);
              setShowEditor(true);
            }}
          >
            <Text style={styles.noteTitle}>
              {item.pinned ? '📌 ' : ''}
              {item.title || 'Untitled'}
            </Text>
            <Text style={styles.noteDate}>
              {item.updatedAt || item.createdAt}
            </Text>
          </TouchableOpacity>
        )}
      />

      {/* Note Editor */}
      <NoteEditor
        visible={showEditor}
        note={selectedNote}
        onClose={() => setShowEditor(false)}
        onSave={(data) => {
          if (data.id) {
            // 🟡 Existing note → auto / manual save
            editNote(data);
          } else {
            // 🟢 New note → insert + close
            addNote({
              ...data,
              pinned: 0,
            });
            setShowEditor(false);
          }
        }}
        onDelete={(id) => {
          deleteNote(id);
          setShowEditor(false);
        }}
      />
    </View>
  );
}

/* ❌ DESIGN NOT CHANGED */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: {
    backgroundColor: '#374151',
    padding: 14,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  noteItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  noteTitle: { fontWeight: 'bold' },
  noteDate: { fontSize: 12, color: '#6b7280' },
  homeButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#22c55e',
    padding: 16,
    borderRadius: 50,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
});
