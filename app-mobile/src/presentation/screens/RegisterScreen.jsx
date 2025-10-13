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
// NOTA: Se asume que 'expo-linear-gradient', 'react-native-safe-area-context' y 'react-native-keyboard-aware-scroll-view' están instalados.
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; 

import UserRepositoryImpl from '../../infrastructure/repositories/UserRepositoryImpl';
import RegisterUseCase from '../../application/useCases/RegisterUseCase';

import Toast from 'react-native-toast-message'; //Mensaje global

// --- Importación del Hook de Validación ---
import { useRegisterValidation } from '../../application/hooks/useRegisterValidation'; 

// --- CONSTANTES DE DISEÑO (Iguales al LoginScreen) ---
const PRIMARY_COLOR = '#EC9D02'; // Naranja Principal
const GRADIENT_COLORS = ['#FFD700', PRIMARY_COLOR, '#B8860B'];
const ERROR_COLOR = '#D9534F'; 
const { height } = Dimensions.get('window');

export default function RegisterScreen({ navigation }) {
    const insets = useSafeAreaInsets(); 

    // 9 Campos de estado + Error de API
    const [nombreUsuario, setNombreUsuario] = useState('');
    const [nombre, setNombre] = useState('');
    const [apellidoP, setApellidoP] = useState('');
    const [apellidoM, setApellidoM] = useState('');
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
        nombreUsuarioError,
        nombreError,
        apellidoPError,
        apellidoMError,
        correoUsuarioError,
        contrasenaUsuarioError,
        confirmarContrasenaError,
        telefonoUsuarioError,
        placasVehiculoError,
        validateFields, 
        resetErrors 
    } = useRegisterValidation(
        nombreUsuario,
        nombre,
        apellidoP,
        apellidoM,
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
                    text2: message,
                    position: 'top',
                  });
            
            setTimeout(() => navigation.navigate('Login'), 1500);

        } catch (e) {

             // ❌ Toast de error
                  Toast.show({
                    type: 'error',
                    text1: 'Error al intentar registrar la cuenta',
                    text2: e.message || 'Intenta nuevamente',
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

    // Función de ayuda para renderizar un campo de input con su lógica de error
    const renderInput = ({
        label,
        value,
        setter,
        error,
        icon,
        isPassword = false,
        keyboardType = 'default',
        autoCapitalize = 'words',
        showPass, 
        togglePass,
        style = {}
    }) => (
        <View key={label} style={style}>
            <View 
                style={[
                    styles.inputGroup, 
                    getInputBorderStyle(error),
                ]}
            >
                <MaterialCommunityIcons
                    name={icon}
                    size={20}
                    color={error ? ERROR_COLOR : '#888'} 
                    style={styles.icon}
                />
                <TextInput
                    placeholder={label}
                    value={value}
                    onChangeText={setter}
                    secureTextEntry={isPassword ? !showPass : false}
                    style={styles.input}
                    placeholderTextColor="#888"
                    keyboardType={keyboardType}
                    autoCapitalize={autoCapitalize}
                    selectionColor={PRIMARY_COLOR}
                    autoCorrect={false}
                    underlineColorAndroid="transparent"
                />
                {isPassword && (
                    <TouchableOpacity
                        onPress={togglePass}
                        style={styles.passwordToggle}
                    >
                        <Ionicons
                            name={showPass ? 'eye-off-outline' : 'eye-outline'}
                            size={20}
                            color={error ? ERROR_COLOR : '#888'}
                        />
                    </TouchableOpacity>
                )}
            </View>
            {error ? <Text style={styles.validationErrorText}>{error}</Text> : null}
        </View>
    );

    // Campos a renderizar en orden
    const inputFields = [
        { label: "Nombre", value: nombre, setter: setNombre, error: nombreError, icon: "account" },
        { label: "Apellido Paterno", value: apellidoP, setter: setApellidoP, error: apellidoPError, icon: "account-details" },
        { label: "Apellido Materno", value: apellidoM, setter: setApellidoM, error: apellidoMError, icon: "account-details-outline", autoCapitalize: 'words' },
        { label: "Nombre de Usuario", value: nombreUsuario, setter: setNombreUsuario, error: nombreUsuarioError, icon: "account-circle", autoCapitalize: 'none' },
        { label: "Teléfono", value: telefonoUsuario, setter: setTelefonoUsuario, error: telefonoUsuarioError, icon: "phone", keyboardType: 'phone-pad', autoCapitalize: 'none' },
        { label: "Correo Electrónico", value: correoUsuario, setter: setCorreoUsuario, error: correoUsuarioError, icon: "email", keyboardType: 'email-address', autoCapitalize: 'none' },
        { 
            label: "Contraseña", value: contrasenaUsuario, setter: setContrasenaUsuario, error: contrasenaUsuarioError, icon: "lock-outline", 
            isPassword: true, showPass: showPassword, togglePass: () => setShowPassword(!showPassword), autoCapitalize: 'none' 
        },
        { 
            label: "Confirmar Contraseña", value: confirmarContrasena, setter: setConfirmarContrasena, error: confirmarContrasenaError, icon: "lock-check", 
            isPassword: true, showPass: showConfirmPassword, togglePass: () => setShowConfirmPassword(!showConfirmPassword), autoCapitalize: 'none' 
        },
        { label: "Placas del Vehículo", value: placasVehiculo, setter: setPlacasVehiculo, error: placasVehiculoError, icon: "car-info", autoCapitalize: 'characters' },
    ];


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
                        
                        {/* Renderizar todos los campos */}
                        {inputFields.map((field, index) => renderInput({ 
                            ...field, 
                            style: {width: '100%', marginTop: index === 0 ? 0 : 10 } 
                        }))}

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
                                { paddingBottom: insets.bottom + 10 },
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

// ---
// ## ESTILOS (Adaptados de LoginScreen para consistencia)
// ---
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
        paddingBottom: 40, 
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
