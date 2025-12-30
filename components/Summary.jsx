import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useData } from '../context/DataContext';
import SummaryList from './SummaryList';

export default function Summary() {
  const { expenses, incomes } = useData();
  const router = useRouter();

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.container}>
      {/* Reports Card */}
      <TouchableOpacity
        style={styles.reportCard}
        activeOpacity={0.85}
        onPress={() => router.push('/report')}
      >
        <View style={styles.reportIcon}>
          <MaterialCommunityIcons name='chart-bar' size={32} color='#4338ca' />
        </View>
        <Text style={styles.reportText}>Reports</Text>
      </TouchableOpacity>

      {/* Summary Cards */}
      <View style={styles.SummaryBoxes}>
        <SummaryList totalExpense={totalExpense} totalIncome={totalIncome} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 12,
    marginVertical: 12,
  },

  /* -------- Reports -------- */
  reportCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 6px 30px #00000022',
  },

  reportIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  reportText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4338ca',
  },
  SummaryBoxes: {
    flex: 2,
  },
});
