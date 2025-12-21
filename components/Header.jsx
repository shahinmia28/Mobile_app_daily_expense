import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useData } from '../context/DataContext';

import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Header() {
  const { expenses, incomes } = useData();
  const router = useRouter();

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Left Side Logo + Title */}
        <TouchableOpacity style={styles.left} onPress={() => router.push('/')}>
          <View style={styles.logo}>
            <Text style={styles.logoText}>💰</Text>
          </View>
          <Text style={styles.title}>আমার হিসাব</Text>
        </TouchableOpacity>

        {/* Right Side Balance */}
        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>ব্যালেন্স</Text>
          <Text style={styles.balanceValue}>
            <MaterialCommunityIcons
              name='currency-bdt'
              size={20}
              color='white'
            />{' '}
            {balance}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
    // backgroundColor: '#ffffff',
  },
  container: {
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(0,128,128,0.7)',
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  logo: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#ffffff33',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: { fontSize: 20, color: 'white' },
  title: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  balanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#ffffff33',
  },
  balanceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
