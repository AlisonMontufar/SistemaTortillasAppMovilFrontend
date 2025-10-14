import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Dimensions,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import RecoverPasswordRepositoryImpl from '../../infrastructure/repositories/RecoverPasswordRepositoryImpl';
import SendRecoveryCodeUseCase from '../../application/useCases/SendRecoveryCodeUseCase';
import VerifyRecoveryCodeUseCase from '../../application/useCases/VerifyRecoveryCodeUseCase';
import ResetPasswordUseCase from '../../application/useCases/ResetPasswordUseCase';
import { useRecoverPasswordValidation } from '../../application/hooks/useRecoverPasswordValidation';

const PRIMARY_COLOR = '#EC9D02';
const ERROR_COLOR = '#D9534F';
const { height } = Dimensions.get('window');

export default function RecoverPasswordScreen({ navigation }) {
  const insets = useSafeAreaInsets();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [step, setStep] = useState(1); // 1=enviar código, 2=verificar, 3=nueva contraseña
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    emailError,
    codeError,
    passwordError,
    confirmPasswordError,
    validateEmail,
    validateCode,
    validatePasswords,
    resetErrors,
  } = useRecoverPasswordValidation(email, code, newPassword, confirmPassword);

  const repository = new RecoverPasswordRepositoryImpl();
  const sendCodeUseCase = new SendRecoveryCodeUseCase(repository);
  const verifyCodeUseCase = new VerifyRecoveryCodeUseCase(repository);
  const resetPasswordUseCase = new ResetPasswordUseCase(repository);

  const handleSendCode = async () => {
    resetErrors();
    if (!validateEmail()) return;

    setLoading(true);
    try {
      await sendCodeUseCase.execute(email);
      Toast.show({
        type: 'success',
        text1: 'Código enviado',
        text2: 'Revisa tu correo electrónico',
        position: 'top',
      });
      setStep(2);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Intenta nuevamente',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    resetErrors();
    if (!validateEmail() || !validateCode()) return;

    setLoading(true);
    try {
      await verifyCodeUseCase.execute(email, code);
      Toast.show({
        type: 'success',
        text1: 'Código verificado',
        text2: 'Ahora puedes restablecer tu contraseña',
        position: 'top',
      });
      setStep(3);
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Intenta nuevamente',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    resetErrors();
    if (!validateEmail() || !validatePasswords()) return;

    setLoading(true);
    try {
      await resetPasswordUseCase.execute(email, newPassword, confirmPassword);
      Toast.show({
        type: 'success',
        text1: 'Contraseña restablecida',
        text2: 'Ahora puedes iniciar sesión',
        position: 'top',
      });
      navigation.navigate('Login');
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: e.message || 'Intenta nuevamente',
        position: 'top',
      });
    } finally {
      setLoading(false);
    }
  };

  const getInputBorderStyle = (error) => ({
    borderColor: error ? ERROR_COLOR : '#eee',
    borderWidth: error ? 2 : 1,
  });

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <>
            <View style={[styles.inputGroup, getInputBorderStyle(emailError)]}>
              <MaterialCommunityIcons
                name="email-outline"
                size={20}
                color={emailError ? ERROR_COLOR : '#888'}
                style={styles.icon}
              />
              <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                selectionColor={PRIMARY_COLOR}
              />
            </View>
            {emailError ? <Text style={styles.validationErrorText}>{emailError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleSendCode} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Enviar código</Text>}
            </TouchableOpacity>
          </>
        );

      case 2:
        return (
          <>
            <View style={[styles.inputGroup, getInputBorderStyle(codeError)]}>
              <MaterialCommunityIcons
                name="numeric"
                size={20}
                color={codeError ? ERROR_COLOR : '#888'}
                style={styles.icon}
              />
              <TextInput
                placeholder="Código de verificación"
                value={code}
                onChangeText={setCode}
                style={styles.input}
                keyboardType="numeric"
              />
            </View>
            {codeError ? <Text style={styles.validationErrorText}>{codeError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleVerifyCode} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Verificar código</Text>}
            </TouchableOpacity>
          </>
        );

      case 3:
        return (
          <>
            <View style={[styles.inputGroup, getInputBorderStyle(passwordError)]}>
              <MaterialCommunityIcons
                name="lock-outline"
                size={20}
                color={passwordError ? ERROR_COLOR : '#888'}
                style={styles.icon}
              />
              <TextInput
                placeholder="Nueva contraseña"
                value={newPassword}
                onChangeText={setNewPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
                selectionColor={PRIMARY_COLOR}
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={passwordError ? ERROR_COLOR : '#888'}
                />
              </TouchableOpacity>
            </View>
            {passwordError ? <Text style={styles.validationErrorText}>{passwordError}</Text> : null}

            <View style={[styles.inputGroup, getInputBorderStyle(confirmPasswordError), { marginTop: 10 }]}>
              <MaterialCommunityIcons
                name="lock-check-outline"
                size={20}
                color={confirmPasswordError ? ERROR_COLOR : '#888'}
                style={styles.icon}
              />
              <TextInput
                placeholder="Confirmar contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                secureTextEntry={!showPassword}
                selectionColor={PRIMARY_COLOR}
              />
              <TouchableOpacity style={styles.passwordToggle} onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                  size={20}
                  color={confirmPasswordError ? ERROR_COLOR : '#888'}
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? <Text style={styles.validationErrorText}>{confirmPasswordError}</Text> : null}

            <TouchableOpacity style={styles.button} onPress={handleResetPassword} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Restablecer contraseña</Text>}
            </TouchableOpacity>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={[styles.container, { paddingBottom: insets.bottom + 20 }]}
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={Platform.select({ ios: 0, android: 20 })}
    >
      <Text style={styles.title}>Recuperar Contraseña</Text>
      {renderStep()}

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>Volver al inicio de sesión</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
}

// --- Estilos ---
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
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
    marginBottom: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    height: '100%',
  },
  passwordToggle: {
    padding: 5,
  },
  validationErrorText: {
    color: ERROR_COLOR,
    fontSize: 12,
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 8,
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 12,
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    marginTop: 15,
    elevation: 5,
    shadowColor: PRIMARY_COLOR,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  link: {
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 20,
  },
});
