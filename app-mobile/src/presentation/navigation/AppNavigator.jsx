import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MainScreen from '../screens/MainScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RecoverPasswordScreen from "../screens/RecoverPasswordScreen"
import ContainerScreen from '../screens/ContainerScreen';
import SignatureScreen from '../screens/SignatureScreen';
import RouteMapOrderScreen from '../screens/RouteMapOrderScreen';
import DetailsOrderScreen from '../screens/DetailsOrderScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen options={{ headerShown: false }} name="Main" component={MainScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Login" component={LoginScreen} />
        <Stack.Screen options={{ headerShown: false }}  name="Register" component={RegisterScreen} />
        <Stack.Screen options={{ headerShown: false }}  name="RecoverPassword" component={RecoverPasswordScreen} />
        <Stack.Screen options={{ headerShown: false }} name="MainContainer" component={ContainerScreen} />
        <Stack.Screen options={{ headerShown: false }} name="Signature" component={SignatureScreen} />
        <Stack.Screen options={{ headerShown: false }} name="RouterMapOrder" component={RouteMapOrderScreen} />
        <Stack.Screen options={{ headerShown: false }} name="DetailsOrder" component={DetailsOrderScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
