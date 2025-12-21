import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useData } from '../context/DataContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function Summary() {
  const { expenses, incomes } = useData();
  const router = useRouter();

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);

  return (
    <View style={styles.container}>
      {/* Reports Button */}
      <TouchableOpacity
        style={styles.reportCard}
        onPress={() => router.push('/report')}
      >
        <View style={styles.reportIcon}>
          <MaterialCommunityIcons
            name='chart-box-outline'
            size={36}
            color='white'
          />
        </View>
        <Text style={styles.reportText}>Reports</Text>
      </TouchableOpacity>

      {/* Summary Boxes */}
      <View style={styles.summaryBoxes}>
        <View style={[styles.box, { backgroundColor: '#22c55e' }]}>
          <Text style={styles.boxTitle}>আয়</Text>
          <Text style={styles.boxValue}>{totalIncome}৳</Text>
        </View>

        <View style={[styles.box, { backgroundColor: '#ef4444' }]}>
          <Text style={styles.boxTitle}>ব্যয়</Text>
          <Text style={styles.boxValue}>{totalExpense}৳</Text>
        </View>

        <View style={[styles.box, { backgroundColor: '#06b6d4' }]}>
          <Text style={styles.boxTitle}>ব্যালেন্স</Text>
          <Text style={styles.boxValue}>{totalIncome - totalExpense}৳</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginVertical: 10,
  },
  reportCard: {
    flex: 1,
    minWidth: 100,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  reportIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#7c3aed',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  reportText: { color: 'white', fontWeight: 'bold', marginTop: 4 },
  summaryBoxes: { flex: 2, gap: 8 },
  box: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  boxTitle: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  boxValue: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});
