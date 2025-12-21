import { FontAwesome } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import ConfirmDeleteModal from '../components/ConfirmDeleteModal';
import EditDeleteModal from '../components/EditDeleteModal';
import EditForm from '../components/EditForm';
import { useData } from '../context/DataContext';
import formatBDDate from '../utils/BDDateTime';

export default function All() {
  const { expenses, incomes, deleteExpense, deleteIncome } = useData();
  const router = useRouter();

  const [mode, setMode] = useState('today');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  // 🔹 combine data
  const combinedData = useMemo(() => {
    return [
      ...incomes.map((i) => ({ ...i, type: 'income' })),
      ...expenses.map((e) => ({ ...e, type: 'expense' })),
    ].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, incomes]);

  // 🔹 filter
  const filteredData = useMemo(() => {
    return combinedData.filter((item) => {
      const d = new Date(item.date);
      if (mode === 'today')
        return d.toDateString() === selectedDate.toDateString();
      if (mode === 'month')
        return (
          d.getMonth() === selectedDate.getMonth() &&
          d.getFullYear() === selectedDate.getFullYear()
        );
      return true;
    });
  }, [mode, combinedData, selectedDate]);

  // 🔹 summary
  const totalIncome = filteredData
    .filter((i) => i.type === 'income')
    .reduce((s, i) => s + Number(i.amount), 0);

  const totalExpense = filteredData
    .filter((i) => i.type === 'expense')
    .reduce((s, i) => s + Number(i.amount), 0);

  const balance = totalIncome - totalExpense;

  // 🔹 delete single
  const handleDeleteSingle = async () => {
    if (!selectedItem) return;
    selectedItem.type === 'income'
      ? await deleteIncome(selectedItem.id)
      : await deleteExpense(selectedItem.id);
    setShowOptionModal(false);
  };

  // 🔥 delete all confirmed
  const handleDeleteAllConfirmed = async () => {
    for (const item of filteredData) {
      item.type === 'income'
        ? await deleteIncome(item.id)
        : await deleteExpense(item.id);
    }
    setShowConfirmDelete(false);
  };

  const renderItem = ({ item }) => (
    <>
      <TouchableOpacity
        style={[
          styles.itemCard,
          item.type === 'income' ? styles.incomeCard : styles.expenseCard,
        ]}
        onPress={() => {
          setSelectedItem(item);
          setShowOptionModal(true);
        }}
      >
        <Text style={styles.itemText}>{formatBDDate(item.date)}</Text>
        <Text
          style={[
            styles.itemText,
            item.type === 'income' ? styles.incomeText : styles.expenseText,
          ]}
        >
          {item.type === 'income' ? 'আয়' : 'ব্যয়'}
        </Text>
        <Text style={styles.itemText}>{item.reason}</Text>
        <Text
          style={[
            styles.itemText,
            item.type === 'income' ? styles.incomeText : styles.expenseText,
          ]}
        >
          {item.type === 'income' ? `৳${item.amount}` : `-৳${item.amount}`}
        </Text>
      </TouchableOpacity>
    </>
  );

  // Sticky Header Component
  const StickyHeader = () => {
    const monthNames = [
      'জানুয়ারি',
      'ফেব্রুয়ারি',
      'মার্চ',
      'এপ্রিল',
      'মে',
      'জুন',
      'জুলাই',
      'আগস্ট',
      'সেপ্টেম্বর',
      'অক্টোবর',
      'নভেম্বর',
      'ডিসেম্বর',
    ];

    const getHeaderTitle = () => {
      let dateText = '';
      if (mode === 'today') dateText = formatBDDate(selectedDate);
      else if (mode === 'month')
        dateText = `${
          monthNames[selectedDate.getMonth()]
        } ${selectedDate.getFullYear()}`;
      else dateText = 'সব';
      return `হিসাব সংক্ষেপ (${dateText})`;
    };

    return (
      <View style={styles.stickyHeader}>
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryTitle}>{getHeaderTitle()}</Text>
          <View style={styles.summaryRow}>
            <View style={[styles.summaryCard, { backgroundColor: '#22c55e' }]}>
              <Text style={styles.summaryLabel}>আয়</Text>
              <Text style={styles.summaryValue}>{totalIncome}৳</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#ef4444' }]}>
              <Text style={styles.summaryLabel}>ব্যয়</Text>
              <Text style={styles.summaryValue}>{totalExpense}৳</Text>
            </View>
            <View style={[styles.summaryCard, { backgroundColor: '#14b8a6' }]}>
              <Text style={styles.summaryLabel}>ব্যালেন্স</Text>
              <Text style={styles.summaryValue}>{balance}৳</Text>
            </View>
          </View>
        </View>

        <TouchableOpacity
          style={styles.dateBtn}
          onPress={() => setShowPicker(true)}
        >
          <FontAwesome name='calendar' size={18} />
          <Text style={{ marginLeft: 8 }}>{formatBDDate(selectedDate)}</Text>
        </TouchableOpacity>

        <View style={styles.modeRow}>
          {['today', 'month', 'all'].map((m) => (
            <TouchableOpacity
              key={m}
              style={[styles.modeBtn, mode === m && styles.modeActive]}
              onPress={() => setMode(m)}
            >
              <Text style={[styles.modeText, mode === m && { color: 'white' }]}>
                {m === 'today' ? 'আজ' : m === 'month' ? 'এই মাস' : 'সব'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.deleteAllBtnContainer}>
          <TouchableOpacity
            onPress={() => setShowConfirmDelete(true)}
            style={styles.deleteAllBtn}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>
              Delete All
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <>
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) =>
          item.id ? `${item.type}-${item.id}` : `${item.type}-${index}`
        }
        renderItem={renderItem}
        contentContainerStyle={{}}
        ListHeaderComponent={<StickyHeader />}
        stickyHeaderIndices={[0]}
      />

      {/* Floating Home Button */}
      <TouchableOpacity style={styles.homeBtn} onPress={() => router.push('/')}>
        <FontAwesome name='home' size={22} color='white' />
      </TouchableOpacity>

      {/* Edit/Delete Modals */}
      {showOptionModal && selectedItem && (
        <EditDeleteModal
          item={selectedItem}
          onClose={() => setShowOptionModal(false)}
          onEdit={() => {
            setShowOptionModal(false);
            setShowEditForm(true);
          }}
          onDelete={handleDeleteSingle}
        />
      )}

      {showEditForm && selectedItem && (
        <EditForm item={selectedItem} onClose={() => setShowEditForm(false)} />
      )}

      {/* Date Picker */}
      {showPicker && (
        <DateTimePicker
          value={selectedDate}
          mode='date'
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={(_, d) => {
            if (d) setSelectedDate(d);
            setShowPicker(false);
          }}
        />
      )}

      {/* Confirm Delete All */}
      <ConfirmDeleteModal
        visible={showConfirmDelete}
        onClose={() => setShowConfirmDelete(false)}
        onConfirm={handleDeleteAllConfirmed}
      />
    </>
  );
}

const styles = StyleSheet.create({
  stickyHeader: { backgroundColor: '#f3f3f3', marginHorizontal: 20 },
  summaryContainer: {},
  summaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  summaryCard: {
    flex: 1,
    marginHorizontal: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  summaryLabel: { color: 'white', fontWeight: 'bold' },
  summaryValue: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  dateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
  },
  modeRow: { flexDirection: 'row', marginBottom: 15 },
  modeBtn: {
    flex: 1,
    marginHorizontal: 4,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
  },
  modeActive: { backgroundColor: '#22c55e' },
  modeText: { fontWeight: 'bold' },
  deleteAllBtnContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  deleteAllBtn: {
    width: '30%',
    backgroundColor: '#dc2626',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 5,
  },
  itemCard: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 20,
    marginVertical: 5,
  },
  incomeCard: { backgroundColor: '#dcfce7' },
  expenseCard: { backgroundColor: '#fee2e2' },
  itemText: { flex: 1, textAlign: 'center' },
  incomeText: { color: '#16a34a', fontWeight: 'bold' },
  expenseText: { color: '#b91c1c', fontWeight: 'bold' },
  homeBtn: {
    position: 'absolute',
    right: 20,
    bottom: 100,
    backgroundColor: '#16a34a',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
});
