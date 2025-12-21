import { Stack } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import Toast from 'react-native-toast-message';
import Header from '../components/Header';
import { DataProvider } from '../context/DataContext';
import { useSQLite } from '../hooks/useSQLite';

export default function Layout() {
  const dbReady = useSQLite();

  if (!dbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size='large' />
      </View>
    );
  }

  return (
    <DataProvider>
      <Header />
      <Stack screenOptions={{ headerShown: false }} />
      <Toast />
    </DataProvider>
  );
}
