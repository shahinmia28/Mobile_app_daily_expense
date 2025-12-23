import { FontAwesome } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function NoteEditor({
  visible,
  note,
  onSave,
  onDelete,
  onClose,
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(0);
  const [saving, setSaving] = useState(false);

  const saveTimer = useRef(null);
  const firstLoad = useRef(true);

  /* ---------- sync note ---------- */
  useEffect(() => {
    setTitle(note?.title || '');
    setContent(note?.content || '');
    setPinned(note?.pinned || 0);
    firstLoad.current = true;
  }, [note, visible]);

  /* ---------- AUTO SAVE ---------- */
  useEffect(() => {
    if (!note?.id) return;
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }

    setSaving(true);

    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(() => {
      onSave({
        id: note.id,
        title,
        content,
        pinned,
      });
      setSaving(false);
    }, 800);

    return () => clearTimeout(saveTimer.current);
  }, [title, content, pinned]);

  /* ---------- SMART LIST ---------- */
  const handleContentChange = (text) => {
    const lines = text.split('\n');
    const prev = lines[lines.length - 2];

    if (text.endsWith('\n') && prev?.match(/^(\d+)\.\s/)) {
      const n = Number(prev.match(/^(\d+)/)[1]) + 1;
      lines[lines.length - 1] = `${n}. `;
      setContent(lines.join('\n'));
      return;
    }
    setContent(text);
  };

  /* ---------- DELETE CONFIRM ---------- */
  const confirmDelete = () => {
    Alert.alert('Delete Note?', 'এই নোটটি মুছে ফেলতে চান?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => onDelete(note.id),
      },
    ]);
  };

  /* ---------- MANUAL SAVE ---------- */
  const handleSave = () => {
    setSaving(true);
    onSave({
      id: note?.id,
      title,
      content,
      pinned,
    });

    setTimeout(() => setSaving(false), 500);
  };

  return (
    <Modal visible={visible} animationType='slide' onRequestClose={onClose}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <FontAwesome name='arrow-left' size={22} color='white' />
          </TouchableOpacity>

          <View style={styles.headerActions}>
            {/* PIN (UNCHANGED COLOR) */}
            <TouchableOpacity onPress={() => setPinned((p) => (p ? 0 : 1))}>
              <FontAwesome
                name='thumb-tack'
                size={20}
                color={pinned ? '#f59e0b' : 'white'}
              />
            </TouchableOpacity>

            {/* SAVE */}
            <TouchableOpacity style={styles.iconBtn} onPress={handleSave}>
              <FontAwesome name='save' size={18} color='white' />
            </TouchableOpacity>

            {/* DELETE */}
            {note?.id && (
              <TouchableOpacity style={styles.iconBtn} onPress={confirmDelete}>
                <FontAwesome name='trash' size={18} color='white' />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Saving Indicator */}
        {saving && <Text style={styles.savingText}>Saving...</Text>}

        <TextInput
          style={styles.title}
          placeholder='Title'
          value={title}
          onChangeText={setTitle}
        />

        <TextInput
          style={styles.content}
          placeholder='Write your note...'
          multiline
          value={content}
          onChangeText={handleContentChange}
        />
      </View>
    </Modal>
  );
}

/* 🎨 DESIGN SAME, ONLY COLOR FIX */
const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, marginTop: 20 },

  header: {
    backgroundColor: '#9f9f9f',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 14,
    borderRadius: 12,
    marginBottom: 6,
  },

  headerActions: {
    flexDirection: 'row',
    gap: 18,
    alignItems: 'center',
  },

  savingText: {
    color: '#6b7280',
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'right',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    marginBottom: 12,
  },

  content: {
    flex: 1,
    textAlignVertical: 'top',
  },
});
