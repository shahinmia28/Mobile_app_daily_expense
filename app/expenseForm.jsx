import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Calculator from '../components/Calculator';
import { useData } from '../context/DataContext';
import BDDateTime from '../utils/BDDateTime';

export default function ExpenseForm() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const { addExpense } = useData();
  const router = useRouter();

  const presets = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 200, 300, 500];
  const handlePreset = (p) => setAmount(String(p));

  const handleSubmit = async () => {
    if (!reason || !amount || !selectedDate) return;

    await addExpense({
      reason,
      amount: Number(amount),
      date: selectedDate.toISOString(), // DB তে পাঠানো হচ্ছে string হিসেবে
    });

    setReason('');
    setAmount('');
    setSelectedDate(new Date());
  };

  useEffect(() => setSelectedDate(new Date()), []);

  const icons = [
    {
      label: 'বাজার',
      icon: <FontAwesome name='money' size={28} color='red' />,
    },
    {
      label: 'বিল',
      icon: <FontAwesome name='credit-card' size={28} color='red' />,
    },
    {
      label: 'ঔষধ',
      icon: <FontAwesome name='plus' size={28} color='red' />,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScrollView
        keyboardShouldPersistTaps='handled'
        contentContainerStyle={styles.container}
      >
        <Text style={styles.header}>নতুন ব্যয় যোগ করুন</Text>

        {/* Reason */}
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder='ব্যয় কিভাবে হয়েছে ?'
        />

        {/* Icon Buttons */}
        <View style={styles.iconRow}>
          {icons.map((item) => (
            <TouchableOpacity
              key={item.label}
              style={[
                styles.iconButton,
                reason === item.label && styles.selectedIconButton,
              ]}
              onPress={() => setReason(item.label)}
            >
              {item.icon}
              <Text>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}
        <Text style={styles.label}>কত টাকা ?</Text>
        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={amount}
          onChangeText={setAmount}
          placeholder='৳ কত টাকা ?'
        />

        {/* Preset Buttons */}
        <View style={styles.presets}>
          {presets.map((p) => (
            <TouchableOpacity
              key={p}
              style={styles.presetButton}
              onPress={() => handlePreset(p)}
            >
              <Text>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Date Picker */}
        <Text style={styles.label}>তারিখ ও সময়</Text>
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
            onChange={(_, date) => {
              if (date) setSelectedDate(date);
              setShowPicker(false);
            }}
          />
        )}

        {/* Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.backButton]}
            onPress={() => router.push('/')}
          >
            <Text style={styles.buttonText}>ফিরে যান</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonText}>হিসাব করুন</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Calculator Floating Button */}
      <TouchableOpacity
        style={styles.calcFloatBtn}
        onPress={() => setShowCalc(true)}
      >
        <FontAwesome name='calculator' size={24} color='white' />
      </TouchableOpacity>

      {/* Calculator Modal */}
      <Calculator
        visible={showCalc}
        onClose={() => setShowCalc(false)}
        onResult={(res) => setAmount(String(res))}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: 'red',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  label: { fontWeight: 'bold', marginBottom: 4 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconButton: {
    width: '30%',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
  },
  selectedIconButton: { borderColor: 'red', backgroundColor: '#fee2e2' },
  presets: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  presetButton: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    margin: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  backButton: { backgroundColor: '#374151' },
  submitButton: { backgroundColor: 'red' },
  buttonText: { color: 'white', fontWeight: 'bold' },
  calcFloatBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#ff8000',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
