import React, { useState } from 'react';
import {
  View,
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 
import Toast from 'react-native-toast-message'; //Mensaje global

// --- Importación del Hook de Validación ---
import { useLoginValidation } from '../../application/hooks/useLoginValidation'; 

// --- CONSTANTES DE DISEÑO ---
const PRIMARY_COLOR = '#EC9D02';
const GRADIENT_COLORS = ['#FFD700', PRIMARY_COLOR, '#B8860B'];
const ERROR_COLOR = '#D9534F'; // Un rojo más definido para errores de validación
const { height } = Dimensions.get('window');

import UserRepositoryImpl from '../../infrastructure/repositories/UserRepositoryImpl';
import LoginUseCase from '../../application/useCases/LoginUseCase';

export default function LoginScreen({ navigation }) {
  const insets = useSafeAreaInsets(); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState(''); // Errores de API/UseCase
  const [loading, setLoading] = useState(false);

  // --- Uso del Hook de Validación ---
  const { 
    usernameError, 
    passwordError, 
    validateFields,
    validateField,
    resetErrors 
  } = useLoginValidation(username, password);
  // --- Fin Uso del Hook ---

  const handleLogin = async () => {
    // 1. Limpiar errores de API y ejecutar validación local
    setApiError('');
    resetErrors(); // Limpiar errores previos de validación
    
    if (!validateFields()) {
      // Si la validación falla (el hook actualizó los estados de error), se detiene aquí.
      return; 
    }

    // 2. Si es válido, proceder con la lógica de negocio (API/UseCase)
    setLoading(true);
    // Nota: UserRepositoryImpl y LoginUseCase requieren sus archivos para funcionar.
    const useCase = new LoginUseCase(new UserRepositoryImpl());
    try {
      const user = await useCase.execute(username, password);
      
      // ✅ Toast de éxito
      Toast.show({
        type: 'success',
        text1: 'Inicio de sesión exitoso 🎉',
        text2: `Bienvenido ${user.Username || 'usuario'}`,
        position: 'top',
      });

      navigation.navigate('Home', { user });
    } catch (e) {

      // ❌ Toast de error
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar sesión',
        text2: e.message || 'Intenta nuevamente',
        position: 'top',
      });
  
      setApiError(e.message); // Usar apiError para errores del UseCase/Repository
    } finally {
      setLoading(false);
    }
  };

  // Función de ayuda para determinar el estilo del borde del input
  const getInputBorderStyle = (error) => ({
    borderColor: error ? ERROR_COLOR : '#eee',
    borderWidth: error ? 2 : 1, // Borde más grueso al fallar
  });

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={GRADIENT_COLORS}
        style={styles.gradientBackground}
        start={{ x: 0.1, y: 0.1 }}
        end={{ x: 0.9, y: 0.9 }}
      >
        <View style={styles.topLogoArea}>
          <View style={styles.logoContainer}>
            <Text style={styles.logoText}>Hola!</Text>
          </View>
        </View>

        <KeyboardAwareScrollView
          style={styles.card}
          contentContainerStyle={styles.cardContentContainer}
          enableOnAndroid={true}
          extraScrollHeight={Platform.select({ ios: 0, android: 20 })} 
          keyboardShouldPersistTaps="handled" 
        >
          <View style={styles.cardContent}>
            <Text style={styles.welcomeText}>BIENVENIDO</Text>
            <Text style={styles.instructionText}>
              Inicia sesión en tu cuenta.
            </Text>

            {/* Campo Usuario/Email */}
            <View 
              style={[
                styles.inputGroup, 
                getInputBorderStyle(usernameError)
              ]}
            >
              <MaterialCommunityIcons
                name="account-circle-outline"
                size={20}
                // Cambia el color del ícono si hay error
                color={usernameError ? ERROR_COLOR : '#888'} 
                style={styles.icon}
              />
              <TextInput
                placeholder="Correo o usuario"
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  // validación en tiempo real
                  validateField('username', text);
                }}
                onBlur={() => validateField('username', username)}
                style={styles.input}
                placeholderTextColor="#888"
                maxLength={20}
                autoCapitalize="none"
                selectionColor={PRIMARY_COLOR}
                autoCorrect={false}
                underlineColorAndroid="transparent"
              />
            </View>
            {/* Mostrar Error de Validación de Usuario */}
            {usernameError ? <Text style={styles.validationErrorText}>{usernameError}</Text> : null}


            {/* Campo Contraseña */}
            <View 
              style={[
                styles.inputGroup, 
                getInputBorderStyle(passwordError),
                // Ajuste de margen para el espaciado
                { marginTop: usernameError ? 5 : 20 } 
              ]}
            >
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                // Cambia el color del ícono si hay error
                color={passwordError ? ERROR_COLOR : '#888'} 
                style={styles.icon}
              />
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  // validación en tiempo real
                  validateField('password', text);
                }}
                onBlur={() => validateField('password', password)}
                secureTextEntry={!showPassword}
                style={styles.input}
                placeholderTextColor="#888"
                selectionColor={PRIMARY_COLOR}
                maxLength={20}
                autoCorrect={false}
                underlineColorAndroid="transparent"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.passwordToggle}
              >
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={passwordError ? ERROR_COLOR : '#888'}
                />
              </TouchableOpacity>
            </View>
            {/* Mostrar Error de Validación de Contraseña */}
            {passwordError ? <Text style={styles.validationErrorText}>{passwordError}</Text> : null}

            {/* Error de API/Lógica de Negocio (Global) */}
            {/*apiError ? <Text style={styles.errorText}>{apiError}</Text> : null*/}
            
            {/* Recuperar contraseña */}
            <TouchableOpacity
              onPress={() => navigation.navigate('RecoverPassword')}
              style={[
                styles.forgotPasswordButton, 
                // Ajusta el margen superior para que no choque con el error de la contraseña
                { marginTop: passwordError ? 5 : 20 }
              ]}
            >
              <Text style={styles.forgotPasswordText}>
                ¿Olvidaste tu contraseña?
              </Text>
            </TouchableOpacity>

            {/* Botón Login */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              style={styles.loginButton}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.loginButtonText}>INICIAR SESIÓN</Text>
              )}
            </TouchableOpacity>

            {/* Registro */}
            <View
              style={[
                styles.registerFooter,
                { paddingBottom: insets.bottom + 10 },
              ]}
            >
              <Text style={styles.registerText}>
                ¿No tienes una cuenta?{' '}
                <Text
                  style={styles.registerLink}
                  onPress={() => navigation.navigate('Register')}
                >
                  Regístrate
                </Text>
              </Text>
            </View>
          </View>
        </KeyboardAwareScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

// ---
// ## ESTILOS
// ---
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
  },
  gradientBackground: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  topLogoArea: {
    height: height * 0.35, 
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginTop: 0,
  },
  logoText: {
    fontSize: 90,
    fontWeight: '900',
    color: 'white',
  },
  card: {
    width: '100%',
    height: height * 0.65, 
    backgroundColor: 'white',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  cardContentContainer: {
    flexGrow: 1, 
    alignItems: 'center',
    paddingBottom: 20, 
  },
  cardContent: {
    width: '90%',
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  instructionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
    borderBottomWidth: 0,
    paddingVertical: 0,
  },
  passwordToggle: {
    padding: 5,
  },
  // ESTILO PARA ERRORES GENERALES DE API/SERVIDOR
  errorText: {
    color: ERROR_COLOR,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
    width: '100%',
    fontWeight: '600',
  },
  // ESTILO PARA ERRORES DE VALIDACIÓN (más pequeños y cerca del input)
  validationErrorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginTop: 4,
    marginBottom: 10, // Espacio entre el error y el siguiente input/elemento
  },
  forgotPasswordButton: {
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
    alignItems: 'flex-end',
  },
  forgotPasswordText: {
    color: PRIMARY_COLOR,
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginTop: 10,
    elevation: 5,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  loginButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  registerFooter: {
    marginTop: 'auto', 
    paddingTop: 30,
    width: '100%',
    alignItems: 'center',
  },
  registerText: {
    textAlign: 'center',
    color: '#666',
    fontSize: 15,
  },
  registerLink: {
    fontWeight: 'bold',
    color: PRIMARY_COLOR,
  },
});
