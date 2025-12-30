import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useData } from '../context/DataContext';

export default function Report() {
  const { incomes, expenses } = useData();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const startOfMonth = selectedMonth.startOf('month').toDate();
  const endOfMonth = selectedMonth.endOf('month').toDate();

  const filterByMonth = (data) =>
    data.filter((i) => {
      const d = new Date(i.date);
      return d >= startOfMonth && d <= endOfMonth;
    });

  const incomeData = useMemo(
    () => summarize(filterByMonth(incomes)),
    [incomes, selectedMonth]
  );

  const expenseData = useMemo(
    () => summarize(filterByMonth(expenses)),
    [expenses, selectedMonth]
  );

  const totalIncome = incomeData.total;
  const totalExpense = expenseData.total;

  const total = totalIncome;

  const expensePercent =
    total === 0 ? 0 : Math.round((totalExpense / total) * 100);

  const balanceAmount = totalIncome - totalExpense;

  const balancePercent =
    total === 0 ? 0 : Math.round((balanceAmount / total) * 100);

  return (
    <ScrollView style={styles.container}>
      {/* ===== TOP BAR ===== */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Feather name='arrow-left' size={22} />
        </TouchableOpacity>

        <View style={styles.monthSelector}>
          <TouchableOpacity
            onPress={() => setSelectedMonth(selectedMonth.subtract(1, 'month'))}
          >
            <Feather name='chevron-left' size={18} />
          </TouchableOpacity>

          <Text style={styles.monthText}>
            {selectedMonth.format('MMMM YYYY')}
          </Text>

          <TouchableOpacity
            onPress={() => setSelectedMonth(selectedMonth.add(1, 'month'))}
          >
            <Feather name='chevron-right' size={18} />
          </TouchableOpacity>
        </View>

        <View style={{ width: 22 }} />
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          আয় অনুযায়ী ব্যয় ও ব্যালেন্স
          <Text style={{ color: '#16a34a' }}> ({total})</Text>
        </Text>
        {/* ===== BALANCE ===== */}
        <Text style={[styles.expensePercentText, { color: '#16a34a' }]}>
          ব্যালেন্স: {balanceAmount}৳ · {balancePercent}%
        </Text>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${balancePercent}%`,
                backgroundColor: '#16a34a',
              },
            ]}
          />
        </View>

        {/* ===== EXPENSE ===== */}
        <Text
          style={[
            styles.expensePercentText,
            { color: '#dc2626', marginTop: 10 },
          ]}
        >
          ব্যয়: {totalExpense}৳ · {expensePercent}%
        </Text>

        <View style={styles.progressBg}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${expensePercent}%`,
                backgroundColor: '#dc2626',
              },
            ]}
          />
        </View>
      </View>

      {/* ===== INCOME DETAILS ===== */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>আয়ের বিস্তারিত</Text>

        {incomeData.items.map((i, idx) => (
          <HorizontalBar
            key={idx}
            name={i.reason}
            amount={i.amount}
            percent={i.percent}
            color={INCOME_COLORS[idx % INCOME_COLORS.length]}
          />
        ))}
      </View>

      {/* ===== EXPENSE DETAILS ===== */}
      <View style={[styles.card, { marginBottom: 100 }]}>
        <Text style={styles.sectionTitle}>ব্যয়ের বিস্তারিত</Text>

        {expenseData.items.map((i, idx) => (
          <HorizontalBar
            key={idx}
            name={i.reason}
            amount={i.amount}
            percent={i.percent}
            color={EXPENSE_COLORS[idx % EXPENSE_COLORS.length]}
          />
        ))}
      </View>
    </ScrollView>
  );
}

/* ================= HELPERS ================= */

function summarize(data) {
  const map = {};
  data.forEach((i) => {
    map[i.reason] = (map[i.reason] || 0) + Number(i.amount);
  });

  const total = Object.values(map).reduce((s, v) => s + v, 0);

  const items = Object.keys(map)
    .map((key) => ({
      reason: key,
      amount: map[key],
      percent: total === 0 ? 0 : Math.round((map[key] / total) * 100),
    }))
    // 🔥 SORT BY HIGHEST %
    .sort((a, b) => b.percent - a.percent);

  return { total, items };
}

/* ================= COMPONENT ================= */

function HorizontalBar({ name, amount, percent, color }) {
  return (
    <View style={styles.rowItem}>
      <View style={styles.rowHeader}>
        <Text style={styles.reason}>{name}</Text>
        <Text style={styles.value}>
          {amount}৳ · {percent}%
        </Text>
      </View>

      <View style={styles.progressBg}>
        <View
          style={[
            styles.progressFill,
            { width: `${percent}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

/* ================= COLORS ================= */

const INCOME_COLORS = ['#16a34a', '#22c55e', '#4ade80', '#86efac', '#a9fec8'];
const EXPENSE_COLORS = ['#dc2626', '#ef4444', '#f87171', '#fecaca', '#ffd9d9'];

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    height: '100%',
    paddingBottom: 50,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  monthText: {
    marginHorizontal: 8,
    fontWeight: '700',
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },

  expensePercentText: {
    fontWeight: '700',
    color: '#dc2626',
    marginBottom: 6,
  },

  rowItem: {
    marginBottom: 14,
  },

  rowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  reason: {
    fontWeight: '600',
    color: '#374151',
  },

  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },

  progressBg: {
    height: 10,
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },
});
