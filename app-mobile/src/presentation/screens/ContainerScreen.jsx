import React, { useState } from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import BottomNavBar from '../components/BottomNavBar';
import HomeScreen from '../screens/HomeScreen';
//import OrdersScreen from '../screens/OrdersScreen';
//import ProfileScreen from '../screens/ProfileScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function ContainerScreen({route}) {
  
  const insets = useSafeAreaInsets();
  const [currentTab, setCurrentTab] = useState('Home'); // Estado de pantalla actual
  
  const saveUserToStorage = async (user) => {
    try {
      await AsyncStorage.setItem('user', JSON.stringify(user));
      console.log('Usuario guardado en AsyncStorage');
    } catch (error) {
      console.error('Error guardando usuario:', error);
    }
  };
  const { user } = route.params; // <-- Aquí extraes el user
  saveUserToStorage(user);

  // Función para renderizar la pantalla según el tab
  const renderScreen = () => {
    switch (currentTab) {
      case 'Home':
        return <HomeScreen/>;
      //case 'Orders':
      //  return <OrdersScreen />;
      //case 'Profile':
      //  return <ProfileScreen />;
      default:
        return <HomeScreen/>;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <View style={{ backgroundColor: 'white', paddingBottom: insets.bottom }}>
        <BottomNavBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
