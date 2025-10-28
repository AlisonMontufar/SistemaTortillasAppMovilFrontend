// src/components/BottomNavBar.jsx
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function BottomNavBar({ currentTab, setCurrentTab }) {
  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        height: 50,
      }}
    >
      <TouchableOpacity onPress={() => setCurrentTab('Home')}>
        <Ionicons
          name="home"
          size={26}
          color={currentTab === 'Home' ? '#033B56' : '#999'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentTab('Orders')}>
        <Ionicons
          name="list"
          size={26}
          color={currentTab === 'Orders' ? '#033B56' : '#999'}
        />
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setCurrentTab('Profile')}>
        <Ionicons
          name="person"
          size={26}
          color={currentTab === 'Profile' ? '#033B56' : '#999'}
        />
      </TouchableOpacity>
    </View>
  );
}
