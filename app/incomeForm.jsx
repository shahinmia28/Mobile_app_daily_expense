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

export default function IncomeForm() {
  const [reason, setReason] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showCalc, setShowCalc] = useState(false);
  const { addIncome } = useData();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!reason || !amount || !selectedDate) return;

    await addIncome({
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
      label: 'ব্যবসার লাভ',
      icon: <FontAwesome name='credit-card' size={28} color='#14b8a6' />,
    },
    {
      label: 'বেতন',
      icon: <FontAwesome name='money' size={28} color='#14b8a6' />,
    },
    {
      label: 'টিউশন ফি',
      icon: <FontAwesome name='plus' size={28} color='#14b8a6' />,
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
        <Text style={styles.header}>আয় যোগ করুন</Text>

        {/* Reason */}
        <TextInput
          style={styles.input}
          value={reason}
          onChangeText={setReason}
          placeholder='আয় কিভাবে হয়েছে ?'
        />

        {/* Icons */}
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
              <Text style={{ color: '#5f5f5f' }}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Amount */}

        <TextInput
          style={styles.input}
          keyboardType='numeric'
          value={amount}
          onChangeText={setAmount}
          placeholder='৳ কত টাকা ?'
        />

        {/* Date Picker */}

        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: '#5f5f5f' }}>{BDDateTime(selectedDate)}</Text>
        </TouchableOpacity>
        {showPicker && (
          <DateTimePicker
            value={selectedDate}
            mode='date'
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={(_, date) => {
              if (date) setSelectedDate(date);
              if (Platform.OS === 'android') setShowPicker(false);
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
        <FontAwesome name='calculator' size={35} color='#ff8000' />
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
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#ffffff',
    height: '100%',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#14b8a6',
  },
  input: {
    backgroundColor: '#ffffff',
    boxShadow: '0 6px 30px #00000022',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  label: { fontWeight: 'bold', marginBottom: 4 },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8,
  },
  iconButton: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    boxShadow: '0 6px 30px #00000022',
    borderRadius: 12,
  },
  selectedIconButton: { backgroundColor: '#14b8a594' },

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
  submitButton: { backgroundColor: '#14b8a6' },
  buttonText: { color: 'white', fontWeight: 'bold' },

  openCalcBtn: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 100,
    alignItems: 'center',
    boxShadow: '0 6px 30px #00000022',
  },
  openCalcBtnContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    alignItems: 'center',
  },
  openCalcBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  calcFloatBtn: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 20px #00000022',
  },
});
