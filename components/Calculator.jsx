import { useRef, useState } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Calculator({
  visible,
  onClose,
  onResult,
  initialValue = '',
}) {
  const [input, setInput] = useState(initialValue);
  const [selection, setSelection] = useState({
    start: initialValue.length,
    end: initialValue.length,
  });
  const inputRef = useRef();

  // Live result calculate
  const calculateResult = (expr) => {
    if (!expr) return '0';
    try {
      const sanitized = expr.replace(/%/g, '/100');
      const res = eval(sanitized);
      return res;
    } catch {
      return 'Error';
    }
  };

  // Handle button press
  const handlePress = (val) => {
    const operators = ['+', '-', '*', '/'];
    const start = selection.start;
    const end = selection.end;
    let newInput = input;

    // Operator overwrite logic
    if (operators.includes(val)) {
      if (input && operators.includes(input[start - 1])) {
        newInput = input.slice(0, start - 1) + val + input.slice(end);
        setInput(newInput);
        const cursorPos = start;
        setSelection({ start: cursorPos, end: cursorPos });
        return;
      }
    }

    // Normal insert
    newInput = input.slice(0, start) + val + input.slice(end);
    setInput(newInput);
    const cursorPos = start + val.length;
    setSelection({ start: cursorPos, end: cursorPos });
  };

  const handleAllClear = () => {
    setInput('');
    setSelection({ start: 0, end: 0 });
  };

  const handleSingleClear = () => {
    const start = selection.start;
    const end = selection.end;
    if (start === 0 && end === 0) return;
    const newInput = input.slice(0, start - 1) + input.slice(end);
    setInput(newInput);
    const cursorPos = start - 1 < 0 ? 0 : start - 1;
    setSelection({ start: cursorPos, end: cursorPos });
  };

  const handleEqual = () => {
    const res = calculateResult(input);
    if (res !== 'Error') {
      setInput(res.toString());
      setSelection({
        start: res.toString().length,
        end: res.toString().length,
      });
      if (onResult) onResult(res);
    }
  };

  const buttons = [
    ['7', '8', '9', '/'],
    ['4', '5', '6', '*'],
    ['1', '2', '3', '-'],
    ['0', '.', '%', '+'],
  ];

  return (
    <Modal visible={visible} animationType='slide' transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Input Field with cursor, keyboard-free */}
          <TextInput
            ref={inputRef}
            style={styles.inputDisplay}
            value={input}
            onChangeText={setInput}
            selection={selection}
            onSelectionChange={(e) => setSelection(e.nativeEvent.selection)}
            keyboardType='numeric'
            showSoftInputOnFocus={false} // Mobile keyboard disable
          />

          {/* Live Result Field */}
          <View style={styles.resultDisplay}>
            <Text style={styles.resultText} selectable>
              {calculateResult(input)}
            </Text>
          </View>

          {/* Calculator Buttons */}
          {buttons.map((row, rIdx) => (
            <View key={rIdx} style={styles.row}>
              {row.map((btn) => (
                <TouchableOpacity
                  key={btn}
                  style={styles.btn}
                  onPress={() => handlePress(btn)}
                >
                  <Text style={styles.btnText}>{btn}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          {/* Bottom Row: AC | C | = | Cancel */}
          <View style={styles.bottomRow}>
            <TouchableOpacity
              style={[styles.bottomBtn, { backgroundColor: '#999' }]}
              onPress={handleAllClear}
            >
              <Text style={styles.bottomBtnText}>AC</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomBtn, { backgroundColor: '#999' }]}
              onPress={handleSingleClear}
            >
              <Text style={styles.bottomBtnText}>C</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomBtn, { backgroundColor: '#222' }]}
              onPress={handleEqual}
            >
              <Text style={[styles.bottomBtnText, { color: 'white' }]}>=</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.bottomBtn, { backgroundColor: '#222' }]}
              onPress={onClose}
            >
              <Text style={[styles.bottomBtnText, { color: 'white' }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
  },
  inputDisplay: {
    height: 60,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 5,
    fontSize: 28,
    paddingHorizontal: 10,
    textAlign: 'right',
  },
  resultDisplay: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 10,
    backgroundColor: '#f3f4f6',
    borderRadius: 10,
    marginBottom: 10,
  },
  resultText: { fontSize: 24, fontWeight: 'bold', color: '#606060' },
  row: { flexDirection: 'row', marginBottom: 10 },
  btn: {
    flex: 1,
    margin: 5,
    height: 60,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  btnText: { fontSize: 22, fontWeight: 'bold' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  bottomBtn: {
    flex: 1,
    margin: 5,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 12,
  },
  bottomBtnText: { fontSize: 20, fontWeight: 'bold', color: '#505050' },
});
