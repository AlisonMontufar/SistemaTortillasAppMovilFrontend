import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import Toast from 'react-native-toast-message';

export default function App() {
  return (
    <PaperProvider>
      <AppNavigator />
      <Toast />
    </PaperProvider>
  );
}
