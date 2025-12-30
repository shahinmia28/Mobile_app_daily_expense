import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useEffect, useState } from 'react';
import {
  Alert,
  BackHandler,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import Toast from 'react-native-toast-message';
import { useData } from '../context/DataContext';
import BDDateTime from '../utils/BDDateTime';

const incomeCategories = ['ব্যবসার লাভ', 'বেতন', 'টিউশন ফি', 'অন্যান্য'];
const expenseCategories = [
  'বাজার',
  'বিল',
  'ঔষধ',
  'ভাড়া',
  'বিনোদন',
  'অন্যান্য',
];

export default function EditDeleteModal({ visible, item, onClose }) {
  const {
    editExpense,
    editIncome,
    deleteExpense,
    deleteIncome,
    addIncome,
    addExpense,
  } = useData();

  const [category, setCategory] = useState(item.reason);
  const [amount, setAmount] = useState(String(item.amount));
  const [selectedDate, setSelectedDate] = useState(new Date(item.date));
  const [showPicker, setShowPicker] = useState(false);

  const categoryList =
    item.type === 'income' ? incomeCategories : expenseCategories;

  /* ---------- ANDROID BACK FIX ---------- */
  useEffect(() => {
    if (!visible) return;

    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onClose();
      return true;
    });

    return () => sub.remove();
  }, [visible]);

  const handleUpdate = async () => {
    if (!category || !amount) {
      Alert.alert('Error', 'Category ও Amount দিন');
      return;
    }

    const updatedItem = {
      id: item.id,
      reason: category,
      amount: Number(amount),
      date: selectedDate.toISOString(),
    };

    item.type === 'income'
      ? await editIncome(updatedItem)
      : await editExpense(updatedItem);

    onClose();
  };

  const handleDelete = () => {
    Alert.alert(
      'Confirm Delete',
      item.type === 'income'
        ? 'এই আয়টি মুছে ফেলতে চান?'
        : 'এই খরচটি মুছে ফেলতে চান?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const backup = { ...item };

            item.type === 'income'
              ? await deleteIncome(item.id)
              : await deleteExpense(item.id);

            onClose();

            Toast.show({
              type: 'success',
              text1: 'Deleted',
              text2: 'UNDO করতে tap করুন',
              autoHide: false,
              onPress: async () => {
                backup.type === 'income'
                  ? await addIncome(backup)
                  : await addExpense(backup);
                Toast.hide();
              },
            });

            setTimeout(() => Toast.hide(), 5000);
          },
        },
      ]
    );
  };

  const headerColor =
    item.type === 'income' ? styles.incomeHeader : styles.expenseHeader;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='fade'
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.header, headerColor]}>
            Edit {item.type === 'income' ? 'Income (আয়)' : 'Expense (খরচ)'}
          </Text>

          {/* ===== CATEGORY INPUT + SELECT INLINE ===== */}
          <View style={styles.inlineContainer}>
            <TextInput
              style={styles.inlineInput}
              placeholder='Category লিখুন'
              value={category}
              onChangeText={setCategory}
            />
            <View style={styles.inlinePickerContainer}>
              <Picker
                selectedValue={category}
                onValueChange={(value) => value && setCategory(value)}
                style={styles.pickerStyle}
              >
                <Picker.Item label='Select' value='' />
                {categoryList.map((cat, i) => (
                  <Picker.Item key={i} label={cat} value={cat} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Amount */}
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            placeholder='Amount'
            value={amount}
            onChangeText={setAmount}
          />

          {/* Date */}
          <TouchableOpacity
            style={styles.input}
            onPress={() => setShowPicker(true)}
          >
            <Text>{BDDateTime(selectedDate)}</Text>
          </TouchableOpacity>

          {showPicker && (
            <DateTimePicker
              value={selectedDate}
              mode='date'
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, date) => {
                if (date) setSelectedDate(date);
                setShowPicker(false);
              }}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Text style={{ color: '#16a34a', fontWeight: 'bold' }}>
                Update
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleDelete}>
              <Text style={{ color: '#d01f1f', fontWeight: 'bold' }}>
                Delete
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onClose}>
              <Text style={{ fontWeight: 'bold' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    elevation: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  incomeHeader: { color: '#16a34a' },
  expenseHeader: { color: '#d01f1f' },

  input: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    elevation: 6,
  },

  /* ===== INLINE CATEGORY ===== */
  inlineContainer: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inlineInput: {
    flex: 1,
    borderRadius: 12,
    padding: 10,
    backgroundColor: '#fff',
    elevation: 6,
    marginRight: 6,
  },
  inlinePickerContainer: {
    width: 120,
    borderRadius: 12,
    backgroundColor: '#fff',
    elevation: 6,
    justifyContent: 'center',
  },
  pickerStyle: {
    height: 50,
    width: '100%',
  },

  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#fff',
    elevation: 6,
  },
});
