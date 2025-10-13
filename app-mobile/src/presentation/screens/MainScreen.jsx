import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient'; 

// --- COLORES ACTUALIZADOS ---
const PRIMARY_COLOR = '#EC9D02'; 

const GRADIENT_COLORS = [
  '#FFD700',
  PRIMARY_COLOR,
  '#B8860B'
];

export default function MainScreen({ navigation }) {
  const handleLogin = () => navigation.navigate('Login');
  const handleGetStarted = () => navigation.navigate('Register');

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={styles.gradientBackground}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      >
        <View style={styles.bubbleOverlay} /> 

        {/* Logo + Nombre */}
        <View style={styles.middleContent}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>TD</Text>
          </View>
          <Text style={styles.appName}>BIENVENIDOS</Text>
        </View>

        {/* Botones */}
        <View style={styles.bottomContent}>
          {/* Botón "Get In" (borde blanco, sin relleno) */}
          <Button
            mode="outlined"
            onPress={handleLogin}
            style={styles.outlinedButton}
            labelStyle={styles.outlinedLabel}
            contentStyle={styles.getStartedButtonContent}
          >
            Get In
          </Button>

          {/* Botón "Get Started" (sólido blanco) */}
          <Button
            mode="contained"
            onPress={handleGetStarted}
            style={styles.filledButton}
            labelStyle={styles.filledLabel}
            contentStyle={styles.getStartedButtonContent}
          >
            Get Started
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

// --- ESTILOS ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'flex-end',
  },
  bubbleOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  middleContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoContainer: {
    marginBottom: 10,
    width: 100,
    height: 100,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 78,
    fontWeight: '900',
    color: 'white',
  },
  appName: {
    fontSize: 40,
    fontWeight: '900',
    color: 'white',
    letterSpacing: 1,
  },
  bottomContent: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: 150,
  },
  getStartedButtonContent: {
    height: 60,
  },
  // --- Botón "Get In" (borde blanco, sin relleno) ---
  outlinedButton: {
    width: '100%',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    backgroundColor: 'transparent',
    marginBottom: 30,
  },
  outlinedLabel: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // --- Botón "Get Started" (sólido blanco) ---
  filledButton: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: 'white',
    elevation: 3,
  },
  filledLabel: {
    color: PRIMARY_COLOR,
    fontSize: 18,
    fontWeight: 'bold',
  },
});
