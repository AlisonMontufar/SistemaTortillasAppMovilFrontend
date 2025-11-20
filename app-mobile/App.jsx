import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import AppNavigator from './src/presentation/navigation/AppNavigator';
import Toast from 'react-native-toast-message';
import { GestureHandlerRootView } from "react-native-gesture-handler";


export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider>
        <AppNavigator />
        <Toast />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}
