import { FontAwesome } from '@expo/vector-icons';
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
import { safeISODate } from '../utils/safeDate';

export default function Today() {
  const { expenses, incomes } = useData();
  const router = useRouter();
  const todayISO = new Date().toISOString().split('T')[0];

  const [selectedItem, setSelectedItem] = useState(null);
  const [showOptionModal, setShowOptionModal] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);

  // const combinedData = [...incomes, ...expenses];
  const combinedData = [
    ...incomes.map((i) => ({ ...i, type: 'income' })),
    ...expenses.map((e) => ({ ...e, type: 'expense' })),
  ];

  const filteredData = combinedData.filter(
    (item) => safeISODate(item.date) === todayISO
  );

  const totalIncome = filteredData
    .filter((i) => i.type === 'income')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const totalExpense = filteredData
    .filter((i) => i.type === 'expense')
    .reduce((sum, i) => sum + Number(i.amount), 0);
  const balance = totalIncome - totalExpense;

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
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        ListHeaderComponent={
          <>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryTitle}>আজকের হিসাব</Text>
              <View style={styles.summaryRow}>
                <View
                  style={[styles.summaryCard, { backgroundColor: '#22c55e' }]}
                >
                  <Text style={styles.summaryLabel}>আয়</Text>
                  <Text style={styles.summaryValue}>{totalIncome}৳</Text>
                </View>
                <View
                  style={[styles.summaryCard, { backgroundColor: '#ef4444' }]}
                >
                  <Text style={styles.summaryLabel}>ব্যয়</Text>
                  <Text style={styles.summaryValue}>{totalExpense}৳</Text>
                </View>
                <View
                  style={[styles.summaryCard, { backgroundColor: '#14b8a6' }]}
                >
                  <Text style={styles.summaryLabel}>ব্যালেন্স</Text>
                  <Text style={styles.summaryValue}>{balance}৳</Text>
                </View>
              </View>
            </View>
          </>
        }
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
      />

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
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#374151',
    padding: 10,
    borderRadius: 30,
    marginBottom: 16,
  },
  backText: { color: 'white', marginLeft: 8 },
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
