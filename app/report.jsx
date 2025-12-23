import { Feather } from '@expo/vector-icons';
import * as d3 from 'd3-shape';
import dayjs from 'dayjs';
import { useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  PanResponder,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';
import { useData } from '../context/DataContext';

const screenWidth = Dimensions.get('window').width;
const CHART_SIZE = screenWidth - 100;

export default function Report() {
  const { expenses, incomes } = useData();
  const router = useRouter();
  const [selectedMonth, setSelectedMonth] = useState(dayjs());

  const startOfMonth = selectedMonth.startOf('month').toDate();
  const endOfMonth = selectedMonth.endOf('month').toDate();

  const filterByMonth = (data) =>
    data.filter((item) => {
      const date = new Date(item.date);
      return date >= startOfMonth && date <= endOfMonth;
    });

  const generateChartData = (data, type) => {
    const map = {};
    data.forEach((item) => {
      if (map[item.reason]) map[item.reason] += Number(item.amount);
      else map[item.reason] = Number(item.amount);
    });

    const colors =
      type === 'income'
        ? [
            '#bd43ff',
            '#008c4b',
            '#00ff5e',
            '#8baaff',
            '#001f76',
            '#0044ff',
            '#9000ff',
            '#4b0085',
          ]
        : [
            '#facc15',
            '#00ff5e',
            '#ef4444',
            '#a855f7',
            '#152cfa',
            '#ff00e1',
            '#9fdd00',
            '#00ffff',
          ];

    return Object.keys(map).map((key, idx) => ({
      name: key,
      amount: map[key],
      color: colors[idx % colors.length],
    }));
  };

  const incomeChartData = generateChartData(filterByMonth(incomes), 'income');
  const expenseChartData = generateChartData(
    filterByMonth(expenses),
    'expense'
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Feather name='arrow-left-circle' size={24} />
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

        <View style={{ width: 24 }} />
      </View>

      <View style={styles.card}>
        <DonutChart data={expenseChartData} title='ব্যয়' />
      </View>

      <View style={styles.card}>
        <DonutChart data={incomeChartData} title='আয়' />
      </View>
    </ScrollView>
  );
}

/* ================= DONUT ================= */

function DonutChart({ data, title }) {
  const size = CHART_SIZE + 40; // chart-er মোট সাইজ
  const radius = CHART_SIZE / 2; // outer radius
  const innerRadius = radius - 110; // donut hole

  const [activeIndex, setActiveIndex] = useState(null);

  const rotateValue = useRef(new Animated.Value(0)).current;

  // ================= PAN RESPONDER =================
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, g) => rotateValue.setValue(g.dx),
      onPanResponderRelease: (_, g) => {
        Animated.decay(rotateValue, {
          velocity: g.vx,
          deceleration: 0.995,
          useNativeDriver: true,
        }).start();
      },
    })
  ).current;

  const rotate = rotateValue.interpolate({
    inputRange: [-300, 300],
    outputRange: ['-180deg', '180deg'],
  });

  // ================= PIE DATA =================
  const pieData = d3.pie().value((d) => d.amount)(data);

  const arc = d3.arc().innerRadius(innerRadius).outerRadius(radius);
  const arcActive = d3
    .arc()
    .innerRadius(innerRadius)
    .outerRadius(radius + 16); // tap করলে slice একটু বড় হয়

  const total = data.reduce((s, i) => s + i.amount, 0);

  return (
    <View style={{ flexDirection: 'column', alignItems: 'center' }}>
      {/* ================= CHART ================= */}
      <View>
        <Animated.View
          {...panResponder.panHandlers}
          style={{ transform: [{ rotate }] }}
        >
          <Svg width={size} height={size}>
            <G x={size / 2} y={size / 2}>
              {pieData.map((slice, i) => {
                const path = activeIndex === i ? arcActive(slice) : arc(slice);

                const [x, y] = arc.centroid(slice);

                // ================= TEXT ALIGN =================
                // Slice-er dike always text thakbe
                const offset = 5; // slice theke distance
                const textX = x >= 0 ? x + offset : x - offset;
                const textAnchor = x >= 0 ? 'start' : 'end';

                return (
                  <G key={i}>
                    <Path
                      d={path}
                      fill={slice.data.color}
                      stroke='#fff'
                      strokeWidth={0.5} // border
                      onPress={() => setActiveIndex(i)}
                    />
                    <SvgText
                      x={textX}
                      y={y}
                      fill='#fff'
                      fontSize='11'
                      fontWeight='400'
                      textAnchor={textAnchor}
                    >
                      {slice.data.amount}
                    </SvgText>
                  </G>
                );
              })}
            </G>
          </Svg>
        </Animated.View>

        {/* ================= CENTER HOLE ================= */}
        <View style={[styles.centerHole, { top: size / 2 - 35 }]}>
          <Text style={styles.centerText}>{title}</Text>
        </View>
      </View>

      {/* ================= LEGEND ================= */}
      <View style={styles.legendRight}>
        {data.map((item, i) => {
          const percent = Math.round((item.amount / total) * 100);
          return (
            <View key={i} style={styles.legendRow} selectable>
              <View style={[styles.dot, { backgroundColor: item.color }]} />
              <Text style={styles.legendText} selectable>
                {item.name} — {item.amount}{' '}
                <Text style={{ color: item.color }}>({percent}%) </Text>
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#ffffff' },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  monthText: {
    marginHorizontal: 8,
    fontWeight: 'bold',
  },

  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    elevation: 4,
  },

  centerHole: {
    position: 'absolute',
    alignSelf: 'center',
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f4f4f4',
    justifyContent: 'center',
    alignItems: 'center',
  },

  centerText: {
    fontWeight: 'bold',
    fontSize: 14,
  },

  legendRight: {
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  legendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  dot: {
    width: 20,
    height: 20,
    borderRadius: '100%',
    marginRight: 6,
  },

  legendText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#333',
  },
});
