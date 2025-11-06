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

import UserRepositoryImpl from '../../infrastructure/repositories/UserRepositoryImpl';
import RegisterUseCase from '../../application/useCases/RegisterUseCase';
import { useRegisterValidation } from '../../application/hooks/useRegisterValidation'; 


// --- CONSTANTES DE DISEÑO (Iguales al LoginScreen) ---
const PRIMARY_COLOR = '#EC9D02'; // Naranja Principal
const GRADIENT_COLORS = ['#FFD700', PRIMARY_COLOR, '#B8860B'];
const ERROR_COLOR = '#D9534F'; 
const { height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
    const insets = useSafeAreaInsets(); 

    // 9 Campos de estado + Error de API
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [correoUsuario, setCorreoUsuario] = useState('');
    const [contrasenaUsuario, setContrasenaUsuario] = useState('');
    const [confirmarContrasena, setConfirmarContrasena] = useState('');
    const [telefonoUsuario, setTelefonoUsuario] = useState('');
    const [placasVehiculo, setPlacasVehiculo] = useState('');
    
    const [apiError, setApiError] = useState(''); 
    const [loading, setLoading] = useState(false);

    // Estado para controlar la visibilidad de las contraseñas
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    // --- Uso del Hook de Validación ---
    const { 
        nombreError,
        apellidoPError,
        apellidoMError,
        nombreUsuarioError,
        correoUsuarioError,
        contrasenaUsuarioError,
        confirmarContrasenaError,
        telefonoUsuarioError,
        placasVehiculoError,
        validateField,
        validateFields, 
        resetErrors 
    } = useRegisterValidation(
        nombre,
        apellidoP,
        apellidoM,
        nombreUsuario,
        correoUsuario,
        contrasenaUsuario,
        confirmarContrasena,
        telefonoUsuario,
        placasVehiculo
    );
    // --- Fin Uso del Hook ---

    const handleRegister = async () => {
        setApiError('');
        resetErrors(); 

        if (!validateFields()) {
            return; 
        }

        setLoading(true);
        // Nota: UserRepositoryImpl y RegisterUseCase requieren sus archivos para funcionar.
            const useCase = new RegisterUseCase(new UserRepositoryImpl());
        try {
            const message = await useCase.execute(
                nombreUsuario, nombre, apellidoP, apellidoM, 
                correoUsuario, contrasenaUsuario, telefonoUsuario, 
                placasVehiculo 
            );
             // ✅ Toast de éxito
                  Toast.show({
                    type: 'success',
                    text1: 'Registro exitoso 🎉',
                    text2: /*message*/ 'Ya eres uno de nosotros!',
                    position: 'top',
                  });
            
            setTimeout(() => navigation.navigate('Login'), 1500);

        } catch (e) {

             // ❌ Toast de error
                  Toast.show({
                    type: 'error',
                    text1: 'Error al intentar registrar la cuenta',
                    text2: /*e.message ||*/ 'Intenta nuevamente',
                    position: 'top',
                  });

        } finally {
            setLoading(false);
        }
    };

    // Función de ayuda para determinar el estilo del borde del input (Consistente con Login)
    const getInputBorderStyle = (error) => ({
        borderColor: error ? ERROR_COLOR : '#eee',
        borderWidth: error ? 2 : 1, 
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
                        <Text style={styles.logoText}>Registrate</Text>
                    </View>
                </View>

                {/* El KeyboardAwareScrollView es CRUCIAL para tantos inputs */}
                <KeyboardAwareScrollView
                    style={styles.card}
                    contentContainerStyle={styles.cardContentContainer}
                    enableOnAndroid={true}
                    extraScrollHeight={Platform.select({ ios: 0, android: 20 })} 
                    keyboardShouldPersistTaps="handled" 
                >
                    <View style={styles.cardContent}>
                        <Text style={styles.welcomeText}>¡CREA TU CUENTA!</Text>
                        <Text style={styles.instructionText}>
                            Completa el formulario con tus datos
                        </Text>
                        
                        {/* Campo Nombre */}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(nombreError),
                            { marginTop: nombreError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="account"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={nombreError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Nombre"
                            value={nombre}
                            onChangeText={(text) => {
                              // 1. **Filtra**: Elimina cualquier dígito (0-9 y permite algunos signos) de la entrada.
                              const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:\-¿?!¡']/g, '');
                              setNombre(filteredText);
                              // validación en tiempo real
                              validateField('nombre', text);
                            }}
                            onBlur={() => validateField('nombre', nombre)}
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
                        {nombreError ? <Text style={styles.validationErrorText}>{nombreError}</Text> : null}
                        
                        {/* Campo apellidoP */}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(apellidoPError),
                            { marginTop: apellidoPError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="account-details"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={apellidoPError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Apellido Paterno"
                            value={apellidoP}
                            onChangeText={(text) => {
                              // 1. **Filtra**: Elimina cualquier dígito (0-9 y permite algunos signos) de la entrada.
                              const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:\-¿?!¡']/g, '');
                              setApellidoP(filteredText);
                              // validación en tiempo real
                              validateField('apellidoP', text);
                            }}
                            onBlur={() => validateField('apellidoP', apellidoP)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={20}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación de Apellido Paterno */}
                        {apellidoPError ? <Text style={styles.validationErrorText}>{apellidoPError}</Text> : null}
                        
                        {/* Campo apellidoM */}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(apellidoMError),
                            { marginTop: apellidoMError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="account-details-outline"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={apellidoMError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Apellido Materno"
                            value={apellidoM}
                            onChangeText={(text) => {
                              // 1. **Filtra**: Elimina cualquier dígito (0-9 y permite algunos signos) de la entrada.
                              const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:\-¿?!¡']/g, '');
                              setApellidoM(filteredText);
                              // validación en tiempo real
                              validateField('apellidoM', text);
                            }}
                            onBlur={() => validateField('apellidoM', apellidoM)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={20}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación de Apellido Materno */}
                        {apellidoMError ? <Text style={styles.validationErrorText}>{apellidoMError}</Text> : null}
                        
                        {/* Campo nombreUsuario*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(nombreUsuarioError),
                            { marginTop: nombreUsuarioError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="account-circle"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={nombreUsuarioError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Nombre de Usuario"
                            value={nombreUsuario}
                            onChangeText={(text) => {
                              setNombreUsuario(text);
                              // validación en tiempo real
                              validateField('nombreUsuario', text);
                            }}
                            onBlur={() => validateField('nombreUsuario', nombreUsuario)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={20}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {nombreUsuarioError ? <Text style={styles.validationErrorText}>{nombreUsuarioError}</Text> : null}
                        
                        {/* Campo correoUsuario*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(correoUsuarioError),
                            { marginTop: correoUsuarioError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="email"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={correoUsuarioError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Correo del Usuario"
                            value={correoUsuario}
                            onChangeText={(text) => {
                              setCorreoUsuario(text);
                              // validación en tiempo real
                              validateField('correoUsuario', text);
                            }}
                            onBlur={() => validateField('correoUsuario', correoUsuario)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={50}
                            keyboardType='email-address'
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {correoUsuarioError ? <Text style={styles.validationErrorText}>{correoUsuarioError}</Text> : null}

                        {/* Campo contrasenaUsuario*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(contrasenaUsuarioError),
                            { marginTop: contrasenaUsuarioError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="lock-outline"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={contrasenaUsuarioError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Contraseña"
                            value={contrasenaUsuario}
                            onChangeText={(text) => {
                              setContrasenaUsuario(text);
                              // validación en tiempo real
                              validateField('contrasenaUsuario', text);
                            }}
                            onBlur={() => validateField('contrasenaUsuario', contrasenaUsuario)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={20}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            secureTextEntry={!showPassword} // 🔑 alterna entre mostrar/ocultar
                          />
                           {/* Botón para mostrar/ocultar */}
                        <TouchableOpacity
                          onPress={() => setShowPassword(!showPassword)}
                          style={styles.iconToggle}
                        >
                          <MaterialCommunityIcons
                            name={showPassword ? "eye-off-outline" : "eye-outline"}
                            size={20}
                            color="#888"
                          />
                        </TouchableOpacity>
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {contrasenaUsuarioError ? <Text style={styles.validationErrorText}>{contrasenaUsuarioError}</Text> : null}
                        
                        {/* Campo confirmarContrasena*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(confirmarContrasenaError),
                            { marginTop: confirmarContrasenaError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="lock-check"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={confirmarContrasenaError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Confirmar Contraseña"
                            value={confirmarContrasena}
                            onChangeText={(text) => {
                              setConfirmarContrasena(text);
                              // validación en tiempo real
                              validateField('confirmarContrasena', text);
                            }}
                            onBlur={() => validateField('confirmarContrasena', confirmarContrasena)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={20}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                            secureTextEntry={!showConfirmPassword} // 🔑 alterna entre mostrar/ocultar
                          />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.iconToggle}
                            >
                                <MaterialCommunityIcons
                                    name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                                    size={20}
                                    color="#888"
                                />
                            </TouchableOpacity>
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {confirmarContrasenaError ? <Text style={styles.validationErrorText}>{confirmarContrasenaError}</Text> : null}
                        
                        {/* Campo telefonoUsuario*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(telefonoUsuarioError),
                            { marginTop: telefonoUsuarioError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="phone"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={telefonoUsuarioError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Numero de Telefono"
                            value={telefonoUsuario}
                            onChangeText={(text) => {
                              setTelefonoUsuario(text);
                              // validación en tiempo real
                              validateField('telefonoUsuario', text);
                            }}
                            onBlur={() => validateField('telefonoUsuario', telefonoUsuario)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            keyboardType="phone-pad" // 👈 Esto abre un teclado numérico con símbolos de teléfono
                            maxLength={10}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {telefonoUsuarioError ? <Text style={styles.validationErrorText}>{telefonoUsuarioError}</Text> : null}
                        
                        {/* Campo placasVehiculo*/}
                        <View 
                          style={[
                            styles.inputGroup, 
                            getInputBorderStyle(placasVehiculoError),
                            { marginTop: placasVehiculoError ? 5 : 20 } 
                          ]}
                        >
                          <MaterialCommunityIcons
                            name="car-info"
                            size={20}
                            // Cambia el color del ícono si hay error
                            color={placasVehiculoError ? ERROR_COLOR : '#888'} 
                            style={styles.icon}
                          />
                          <TextInput
                            placeholder="Placas del Vehiculo"
                            value={placasVehiculo}
                            onChangeText={(text) => {
                              setPlacasVehiculo(text);
                              // validación en tiempo real
                              validateField('placasVehiculo', text);
                            }}
                            onBlur={() => validateField('placasVehiculo', placasVehiculo)}
                            style={styles.input}
                            placeholderTextColor="#888"
                            maxLength={7}
                            autoCapitalize="none"
                            selectionColor={PRIMARY_COLOR}
                            autoCorrect={false}
                            underlineColorAndroid="transparent"
                          />
                        </View>
                        {/* Mostrar Error de Validación del Nombre de Usuario */}
                        {placasVehiculoError ? <Text style={styles.validationErrorText}>{placasVehiculoError}</Text> : null}

                        {/* Error de API/Lógica de Negocio (Global) */}
                        {/*apiError ? <Text style={[styles.errorText, {color: apiError.includes('exitoso') ? PRIMARY_COLOR : ERROR_COLOR}]}>{apiError}</Text> : null*/}

                        {/* Botón de Registro */}
                        <TouchableOpacity
                            onPress={handleRegister}
                            disabled={loading}
                            style={styles.registerButton} 
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerButtonText}>REGISTRARSE</Text>
                            )}
                        </TouchableOpacity>

                        {/* Footer - Enlace a Login */}
                        <View
                            style={[
                                styles.loginFooter, 
                                { paddingBottom: insets.bottom + 20},
                            ]}
                        >
                            <Text style={styles.loginText}>
                                ¿Ya tienes una cuenta?{' '}
                                <Text
                                    style={styles.loginLink}
                                    onPress={() => navigation.navigate('Login')}
                                >
                                    Iniciar Sesión
                                </Text>
                            </Text>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
}

/////////////////////////////////////////////////////////////
// ## ESTILOS (Adaptados de LoginScreen para consistencia) //
/////////////////////////////////////////////////////////////

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: PRIMARY_COLOR,
    },
    gradientBackground: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    topLogoArea: {
        height: height * 0.2, // Reducido para el formulario largo
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    logoContainer: {
        marginTop: Platform.OS === 'ios' ? 0 : 20, 
    },
    logoText: {
        fontSize: 60, 
        fontWeight: '900',
        color: 'white',
    },
    card: {
        width: '100%',
        flex: 1, 
        backgroundColor: 'white',
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
    },
    cardContentContainer: {
        flexGrow: 1, 
        alignItems: 'center',
    },
    cardContent: {
        width: '90%',
        alignItems: 'center',
        paddingTop: 30,
    },
    welcomeText: {
        fontSize: 26, 
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    instructionText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15, 
        textAlign: 'center',
    },
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        height: 48, 
        borderRadius: 10,
        paddingHorizontal: 15,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#eee',
        elevation: 1,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14, 
        color: '#333',
        height: '100%',
        paddingVertical: 0,
    },
    passwordToggle: {
        padding: 5,
    },
    errorText: {
        color: ERROR_COLOR,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
        width: '100%',
        fontWeight: '600',
    },
    validationErrorText: {
        color: ERROR_COLOR,
        fontSize: 12,
        alignSelf: 'flex-start',
        marginLeft: 10,
        marginTop: 4,
        marginBottom: 0, 
    },
    registerButton: {
        width: '100%',
        padding: 15,
        borderRadius: 12,
        backgroundColor: PRIMARY_COLOR,
        alignItems: 'center',
        justifyContent: 'center',
        height: 60,
        marginTop: 20,
        elevation: 5,
        shadowColor: PRIMARY_COLOR,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.4,
        shadowRadius: 5,
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    loginFooter: {
        marginTop: 'auto', 
        paddingTop: 30,
        width: '100%',
        alignItems: 'center',
    },
    loginText: {
        textAlign: 'center',
        color: '#666',
        fontSize: 15,
    },
    loginLink: {
        fontWeight: 'bold',
        color: PRIMARY_COLOR,
    },
});
