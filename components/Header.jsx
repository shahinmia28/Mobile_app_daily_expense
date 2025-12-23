import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useData } from '../context/DataContext';

export default function Header({ onMenu }) {
  const { expenses, incomes } = useData();

  const totalExpense = expenses.reduce((s, e) => s + e.amount, 0);
  const totalIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const balance = totalIncome - totalExpense;

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {/* Hamburger */}
        <TouchableOpacity onPress={onMenu}>
          <MaterialCommunityIcons name='menu' size={28} color='white' />
        </TouchableOpacity>

        <View style={styles.balance}>
          <MaterialCommunityIcons name='currency-bdt' size={18} color='white' />
          <Text style={styles.balanceText}>{balance}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 50,
    alignItems: 'center',
  },
  container: {
    width: '90%',
    backgroundColor: '#008080cc',
    padding: 16,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  balance: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ffffff33',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  balanceText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
