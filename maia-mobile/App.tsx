import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import MAIAScreen from './screens/MAIAScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <MAIAScreen />
    </SafeAreaProvider>
  );
}
