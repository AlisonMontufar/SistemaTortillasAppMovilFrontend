import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import EnterpriseGrid from '../components/EnterpriseGrid';

const PRIMARY_COLOR = '#EC9D02';
const GRADIENT_COLORS = ['#FFD700', PRIMARY_COLOR, '#B8860B'];
const { height, width } = Dimensions.get('window');

export default function HomeScreen() {
  const [user, setUser] = useState(null);
  const fadeAnim = useState(new Animated.Value(0))[0];

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

    // Animación de entrada
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <LinearGradient
      colors={GRADIENT_COLORS}
      style={styles.gradientBackground}
      start={{ x: 0.1, y: 0.1 }}
      end={{ x: 0.9, y: 0.9 }}
      >
      {/* --- CIRCULOS DE DECORACION EN FONDO AMARILLO --- */}
      <View style={styles.decorativeCircle1} />
      <View style={styles.decorativeCircle2} />

      {/* --- CARD SUPERIOR MEJORADO --- */}
      <Animated.View 
        style={[
          styles.cardTop,
          {
            opacity: fadeAnim,
            transform: [{
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-50, 0],
              }),
            }],
          },
        ]}
      >
        {/* Header con mejor espaciado */}
        <View style={styles.headerCard}>
          {/* Perfil con icono en lugar de círculo simple */}
          <View style={styles.profileContainer}>
            <View style={styles.profileCircle}>
              <Ionicons name="person" size={20} color={PRIMARY_COLOR} />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.username} numberOfLines={1}>
                {user?.Username?.toUpperCase() || 'USUARIO'}
              </Text>
              <View style={styles.codeContainer}>
                <View style={styles.codeBadge}>
                  <Text style={styles.userCode}>
                    {user?.code || 'AAA-BSB'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Botón de configuración con mejor feedback */}
          <TouchableOpacity 
            style={styles.iconContainer}
            activeOpacity={0.7}
          >
            <View style={styles.iconWrapper}>
              <Ionicons name="settings-sharp" size={24} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Sección de título con mejor jerarquía */}
        <View style={styles.titleSection}>
          <Text style={styles.welcomeText}> Tu seguridad en el camino </Text>
          <Text style={styles.sectionTitle}> es nuestro mayor compromiso </Text>
          {/* {<View style={styles.titleUnderline} />} */}
        </View>

        
      </Animated.View>
        

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
  },
  cardTop: {
    width: '100%',
    height: height * 0.28,
    paddingHorizontal: 25,
    paddingTop: 50,
    paddingBottom: 20,
    overflow: 'hidden',
  },
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  username: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  codeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  userCode: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
    opacity: 0.9,
  },
  iconContainer: {
    padding: 5,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  welcomeText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  sectionTitle: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 20,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    letterSpacing: 0.5,
  },
  // titleUnderline: {
  //   width: 60,
  //   height: 3,
  //   backgroundColor: 'rgba(255, 255, 255, 0.6)',
  //   borderRadius: 2,
  //   marginTop: 8,
  // },
  decorativeCircle1: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 100,
    backgroundColor: 'rgba(158, 36, 36, 0.05)',
    top: -30,
    right: -30,
  },
  decorativeCircle2: {
    position: 'absolute',
    width: 150,
    height: 150,
    borderRadius: 100,
    backgroundColor: 'rgba(158, 36, 36, 0.05)',
    top: 120,
    left: -20,
  },
  card: {
    width: '100%',
    height: height * 0.72,
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
});