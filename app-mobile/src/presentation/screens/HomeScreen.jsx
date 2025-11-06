import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EnterpriseGrid from '../components/EnterpriseGrid';

const PRIMARY_COLOR = '#EC9D02';
const GRADIENT_COLORS = ['#FFD700', PRIMARY_COLOR, '#B8860B'];
const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.log('Error al obtener usuario:', error);
      }
    };
    getUser();
  }, []);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={styles.gradientBackground}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
    >
      {/* --- CARD SUPERIOR --- */}
      <View style={styles.cardTop}>
        <View style={styles.headerCard}>
          <View style={styles.profileCircle} />
          <View style={styles.textContainer}>
            <Text style={styles.Username}>
              {user?.Username?.toUpperCase() }
            </Text>
            <Text style={styles.userCode}>{user?.code || 'AAA-BSB'}</Text>
          </View>

          <TouchableOpacity style={styles.iconContainer}>
            <Ionicons name="settings-outline" size={40} color="black" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Clientes</Text>
      </View>

      {/* --- CONTENEDOR DE EMPRESAS --- */}
      <View style={styles.card}>
        <EnterpriseGrid />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardTop: {
    width: '100%',
    height: height * 0.25,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 30,
    backgroundColor: 'white',
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  username: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  userCode: {
    color: 'white',
    fontSize: 11,
    opacity: 0.9,
  },
  iconContainer: {
    padding: 5,
  },
  sectionTitle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 40,
    marginTop: 20,
  },
  card: {
    width: '100%',
    height: height * 0.75,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
