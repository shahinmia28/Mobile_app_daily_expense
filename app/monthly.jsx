import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import EditDeleteModal from '../components/EditDeleteModal';
import EditForm from '../components/EditForm';
import { useData } from '../context/DataContext';
import formatBDDate from '../utils/BDDateTime';

export default function Monthly() {
  const { expenses, incomes } = useData();
  const router = useRouter();

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const today = new Date();
  const [selectedMonthIndex, setSelectedMonthIndex] = useState(
    today.getMonth()
  );
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  const combinedData = [
    ...incomes.map((i) => ({ ...i, type: 'income' })),
    ...expenses.map((e) => ({ ...e, type: 'expense' })),
  ];

  const filteredData = combinedData.filter((item) => {
    const date = new Date(item.date);
    return (
      date.getMonth() === selectedMonthIndex &&
      date.getFullYear() === selectedYear
    );
  });

  const totalIncome = filteredData
    .filter((i) => i.type === 'income')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const totalExpense = filteredData
    .filter((i) => i.type === 'expense')
    .reduce((sum, i) => sum + Number(i.amount), 0);

  const balance = totalIncome - totalExpense;

  const changeMonthBy = (delta) => {
    let newIndex = selectedMonthIndex + delta;
    let newYear = selectedYear;
    if (newIndex < 0) {
      newIndex = 11;
      newYear -= 1;
    } else if (newIndex > 11) {
      newIndex = 0;
      newYear += 1;
    }
    setSelectedMonthIndex(newIndex);
    setSelectedYear(newYear);
  };

  const renderItem = ({ item }) => (
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
  );

  return (
    <View style={styles.container}>
      {/* Header & Summary */}
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryTitle}>
          মাসিক হিসাব ({monthNames[selectedMonthIndex]} {selectedYear})
        </Text>
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
            <Text style={styles.summaryLabel}>ব্যালেন্স </Text>
            <Text style={styles.summaryValue}>{balance}৳</Text>
          </View>
        </View>
      </View>

      {/* Month Selector */}
      <View style={styles.monthSelector}>
        <TouchableOpacity
          onPress={() => changeMonthBy(-1)}
          style={styles.arrowButton}
        >
          <FontAwesome name='arrow-left' size={20} />
        </TouchableOpacity>
        <Picker
          selectedValue={monthNames[selectedMonthIndex]}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) =>
            setSelectedMonthIndex(itemIndex)
          }
        >
          {monthNames.map((m) => (
            <Picker.Item key={m} label={m} value={m} />
          ))}
        </Picker>
        <TouchableOpacity
          onPress={() => changeMonthBy(1)}
          style={styles.arrowButton}
        >
          <FontAwesome name='arrow-right' size={20} />
        </TouchableOpacity>
      </View>

      {/* Transactions */}
      <FlatList
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item, index) =>
          item._id ? item._id.toString() : index.toString()
        }
        contentContainerStyle={{ paddingBottom: 150 }}
      />

      {/* Modals */}
      {showOptionModal && (
        <EditDeleteModal
          item={selectedItem}
          onClose={() => setShowOptionModal(false)}
          onEdit={() => {
            setShowOptionModal(false);
            setShowEditForm(true);
          }}
        />
      )}
      {showEditForm && (
        <EditForm item={selectedItem} onClose={() => setShowEditForm(false)} />
      )}

      {/* Home Button */}
      <TouchableOpacity
        style={styles.homeButton}
        onPress={() => router.push('/')}
      >
        <FontAwesome name='home' size={24} color='white' />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  summaryContainer: { marginBottom: 16 },
  summaryTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryCard: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: { color: 'white', fontWeight: 'bold' },
  summaryValue: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  arrowButton: { padding: 8, backgroundColor: '#e5e7eb', borderRadius: 8 },
  picker: { flex: 1 },
  itemCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  incomeCard: { backgroundColor: '#dcfce7' },
  expenseCard: { backgroundColor: '#fee2e2' },
  itemText: { flex: 1, textAlign: 'center' },
  incomeText: { color: '#16a34a', fontWeight: 'bold' },
  expenseText: { color: '#b91c1c', fontWeight: 'bold' },
  homeButton: {
    position: 'absolute',
    bottom: 40,
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
