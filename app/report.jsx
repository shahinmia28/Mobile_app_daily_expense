import { Feather } from '@expo/vector-icons';
import dayjs from 'dayjs';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  Dimensions,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useData } from '../context/DataContext';

const screenWidth = Dimensions.get('window').width;

export default function Report() {
  const { expenses, incomes } = useData();
  const [viewType, setViewType] = useState('monthly'); // monthly / weekly
  const [selectedDate, setSelectedDate] = useState(
    dayjs().format('YYYY-MM-DD')
  );

  // Start & End date for filter
  const getRange = () => {
    const date = dayjs(selectedDate);
    if (viewType === 'monthly') {
      return {
        start: date.startOf('month').toISOString(),
        end: date.endOf('month').toISOString(),
      };
    } else {
      return {
        start: date.startOf('week').toISOString(),
        end: date.endOf('week').toISOString(),
      };
    }
  };

  const { start, end } = getRange();

  const filteredData = [...incomes, ...expenses].filter((item) => {
    const itemDate = new Date(item.date);
    return itemDate >= new Date(start) && itemDate <= new Date(end);
  });

  // pie chart data
  const reasonMap = {};
  filteredData.forEach((item) => {
    if (reasonMap[item.reason]) {
      reasonMap[item.reason] += Number(item.amount);
    } else {
      reasonMap[item.reason] = Number(item.amount);
    }
  });

  const colors = [
    '#FF6384',
    '#36A2EB',
    '#FFCE56',
    '#4BC0C0',
    '#9966FF',
    '#FF9F40',
    '#C9CBCF',
  ];

  const chartData = Object.keys(reasonMap).map((key, index) => ({
    name: key,
    amount: reasonMap[key],
    color: colors[index % colors.length],
    legendFontColor: '#333',
    legendFontSize: 14,
  }));

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      {/* Top Bar */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        {/* Back Button */}
        <TouchableOpacity
          onPress={() => {
            router.push('/');
          }}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: '#374151',
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 24,
          }}
        >
          <Feather name='arrow-left-circle' size={20} color='white' />
          <Text style={{ color: 'white', marginLeft: 6 }}>Back</Text>
        </TouchableOpacity>

        {/* Toggle Buttons */}
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TouchableOpacity
            onPress={() => setViewType('monthly')}
            style={{
              backgroundColor: viewType === 'monthly' ? '#3B82F6' : '#E5E7EB',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: viewType === 'monthly' ? 'white' : '#374151',
                fontWeight: 'bold',
              }}
            >
              Monthly
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setViewType('weekly')}
            style={{
              backgroundColor: viewType === 'weekly' ? '#3B82F6' : '#E5E7EB',
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 24,
            }}
          >
            <Text
              style={{
                color: viewType === 'weekly' ? 'white' : '#374151',
                fontWeight: 'bold',
              }}
            >
              Weekly
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pie Chart */}
      <View
        style={{
          backgroundColor: 'white',
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.1,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 2 },
          elevation: 4,
        }}
      >
        <PieChart
          data={chartData}
          width={screenWidth - 32}
          height={220}
          chartConfig={{
            color: () => `rgba(0, 0, 0, 1)`,
            labelColor: () => `rgba(0,0,0,0.8)`,
          }}
          accessor='amount'
          backgroundColor='transparent'
          paddingLeft='15'
          absolute
        />
      </View>
    </ScrollView>
  );
}
