import { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { FontAwesome } from '@expo/vector-icons';
import Calculator from '../components/Calculator'; // Import your calculator
import CardMenu from '../components/CardMenu';
import FormButton from '../components/FormButton';
import Summary from '../components/Summary';

export default function Home() {
  const [calcVisible, setCalcVisible] = useState(false);
  const [calcResult, setCalcResult] = useState(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Summary />
      <CardMenu />
      <FormButton />

      <View style={styles.openCalcBtnContainer}>
        {calcResult !== null && (
          <Text style={{ marginBottom: 10, fontSize: 12, color: '#767676' }}>
            Result = {calcResult}
          </Text>
        )}
        <TouchableOpacity
          style={styles.openCalcBtn}
          onPress={() => setCalcVisible(true)}
        >
          <FontAwesome name='calculator' size={24} color='white' />
        </TouchableOpacity>
      </View>

      {/* Calculator Modal */}
      <Calculator
        visible={calcVisible}
        onClose={() => setCalcVisible(false)}
        onResult={(res) => setCalcResult(res)}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    alignItems: 'center',
    width: '100%',
    backgroundColor: '#ffffff',
    height: '100%',
  },
  openCalcBtn: {
    backgroundColor: '#ff8000',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  openCalcBtnContainer: {
    position: 'absolute',
    bottom: 100,
    right: 30,
    alignItems: 'center',
  },
  openCalcBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
