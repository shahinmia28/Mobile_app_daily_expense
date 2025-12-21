import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function FormButton() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Income */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#14b8a6' }]}
        onPress={() => router.push('/incomeForm')}
      >
        <Ionicons name='trending-up' size={28} color='white' />
        <Text style={styles.label}>আয়</Text>
      </TouchableOpacity>

      {/* Expense */}
      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#ef4444' }]}
        onPress={() => router.push('/expenseForm')}
      >
        <Ionicons name='trending-down' size={28} color='white' />
        <Text style={styles.label}>ব্যয়</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 16,
    marginHorizontal: 4,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
  },
  label: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 4,
  },
});
