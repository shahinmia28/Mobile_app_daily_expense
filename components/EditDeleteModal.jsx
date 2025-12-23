import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
import { useState } from 'react';
import {
  Alert,
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

const incomeCategories = ['বেতন', 'ব্যবসার লাভ', 'টিউশন ফি', 'অন্যান্য '];
const expenseCategories = ['বাজার', 'বিল', 'ঔষধ', 'বিনোদন', 'অন্যান্য'];

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

  const handleUpdate = async () => {
    const updatedItem = {
      id: item.id, // ✅ SQLite id
      reason: category,
      amount: Number(amount),
      date: selectedDate.toISOString(), // ✅ same DB format
    };

    if (item.type === 'income') {
      await editIncome(updatedItem);
    } else {
      await editExpense(updatedItem);
    }

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
            const deletedItem = { ...item }; // 🔴 backup for undo

            if (item.type === 'income') {
              await deleteIncome(item.id);
            } else {
              await deleteExpense(item.id);
            }

            onClose();

            // ✅ Toast with UNDO
            Toast.show({
              type: 'success',
              text1: 'Deleted successfully',
              text2: 'Tap UNDO to restore',
              position: 'bottom',
              autoHide: false,
              onPress: async () => {
                if (deletedItem.type === 'income') {
                  await addIncome({
                    reason: deletedItem.reason,
                    amount: deletedItem.amount,
                    date: deletedItem.date,
                  });
                } else {
                  await addExpense({
                    reason: deletedItem.reason,
                    amount: deletedItem.amount,
                    date: deletedItem.date,
                  });
                }
                Toast.hide();
              },
            });

            // ⏱️ Auto hide after 5 sec
            setTimeout(() => {
              Toast.hide();
            }, 5000);
          },
        },
      ]
    );
  };
  const headerColor =
    item.type === 'income' ? styles.incomeHeader : styles.expenseHeader;
  const headerText = item.type === 'income' ? 'Income (আয়)' : 'Expense (খরচ)';

  return (
    <Modal visible={visible} transparent animationType='fade'>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.header, headerColor]}>Edit {headerText}</Text>

          {/* Category Picker */}
          <Text style={styles.label}>Category</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={(value) => setCategory(value)}
            >
              <Picker.Item label='-- Select Category --' value='' />
              {categoryList.map((cat, i) => (
                <Picker.Item key={i} label={cat} value={cat} />
              ))}
            </Picker>
          </View>

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            style={styles.input}
            keyboardType='numeric'
            value={amount}
            onChangeText={setAmount}
          />

          {/* Date */}
          <Text style={styles.label}>Date</Text>

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
              onChange={(event, date) => {
                if (date) setSelectedDate(date);
                setShowPicker(false);
              }}
            />
          )}

          {/* Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              style={[styles.button, styles.updateButton]}
              onPress={handleUpdate}
            >
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.deleteButton]}
              onPress={handleDelete}
            >
              <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  incomeHeader: { color: 'green' },
  expenseHeader: { color: 'red' },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 10,
    marginBottom: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 15,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flex: 1,
    marginHorizontal: 3,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateButton: { backgroundColor: 'green' },
  deleteButton: { backgroundColor: 'red' },
  cancelButton: { backgroundColor: '#aaa' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
