import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Signature from 'react-native-signature-canvas';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message'; //Mensaje global


// UseCases
import SignatureUseCase from '../../application/useCases/SignatureUseCase';
import SignatureRepositoryImpl from '../../infrastructure/repositories/SignatureRepositoryImpl';
import UpdateStatusUseCase from '../../application/useCases/UpdateStatusUseCase';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';

// Hook de validación estilo Login
import { useSignatureValidation } from '../../application/hooks/useSignatureValidation';

export default function SignatureScreen({ route }) {
  const { order } = route.params;

  const insets = useSafeAreaInsets(); 
  const navigation = useNavigation();
  const sigRef = useRef(null);

  const [customerName, setCustomerName] = useState('');
  const [signature, setSignature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  // Hook de validaciones
  const {
    customerNameError,
    signatureError,
    validateFields,
    validateField,
    resetErrors
  } = useSignatureValidation(customerName, signature);

  // Recibe la firma cuando el usuario suelta el lápiz
  const handleSignature = (signatureResult) => {
    setSignature(signatureResult);
    validateField('signature', signatureResult);
  };

  const handleEmpty = () => {
    setSignature(null);
    validateField('signature', null);
  };

  // Función para limpiar la firma manualmente
  const handleClearSignature = () => {
    if (sigRef.current) {
      sigRef.current.clearSignature();
      setSignature(null);
      validateField('signature', null);
    }
  };

  const handleSave = async () => {
    resetErrors();

    if (!validateFields()) {
      Alert.alert('Error', 'Revisa los campos marcados en rojo');
      return;
    }

    try {
      setIsSaving(true);

      // Guardar firma en el backend
      const useCaseSignature = new SignatureUseCase(new SignatureRepositoryImpl());
      await useCaseSignature.execute(order.id, signature);

      // Cambiar estatus del pedido
      const useCaseStatus = new UpdateStatusUseCase(new HomeRepositoryImpl());
      await useCaseStatus.execute(order.id, 'Entregado');

      // Limpiar pedido activo
      await AsyncStorage.removeItem('activeOrder');

      // ✅ Toast de éxito
      Toast.show({
        type: 'success',
        text1: 'Firma guardada exitosamente',
        text2: 'El pedido a sido entregado',
        position: 'top',
      });

      navigation.navigate('MainContainer');
      

    } catch (error) {
      console.error(error);
      
      // ❌ Toast de error
      Toast.show({
        type: 'error',
        text1: 'Error al guardar la firma',
        text2: error.message || 'Intenta nuevamente',
        position: 'top',
      });

    } finally {
      setIsSaving(false);
    }
  };

  const style = `
    .m-signature-pad { 
      box-shadow: none; 
      border: none; 
      background-color: #f8f9fa;
    }
    .m-signature-pad--body { 
      border: 1px solid #E5E7EB; 
      background-color: white;
      border-radius: 8px;
    }
    .m-signature-pad--footer { 
      display: none; 
    }
    body, html { 
      width: 100%; 
      height: 100%; 
      margin: 0; 
      padding: 0; 
    }
  `;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#083D56" />
        </TouchableOpacity>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Capturar Firma</Text>
        </View>
        <View style={styles.placeholder} />
      </View>

      {/* Nombre del Cliente */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nombre del cliente *</Text>
        <TextInput
          style={[
            styles.input,
            customerNameError && styles.inputError
          ]}
          placeholder="Ingresa el nombre completo del cliente"
          value={customerName}
          onChangeText={(text) => {
            const filteredText = text.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s.,;:\-¿?!¡']/g, '');
            setCustomerName(filteredText);
            validateField('customerName', text);
          }}
          onBlur={() => validateField('customerName', customerName)}
        />
        {customerNameError ? (
          <Text style={styles.errorText}>{customerNameError}</Text>
        ) : null}
      </View>

      {/* Área de Firma */}
      <View style={styles.signatureContainer}>
        <View style={styles.signatureHeader}>
          <Text style={styles.label}>Firma del cliente *</Text>
          {signature && (
            <TouchableOpacity 
              style={styles.clearButton}
              onPress={handleClearSignature}
            >
              <Ionicons name="trash-outline" size={18} color="#EF4444" />
              <Text style={styles.clearButtonText}>Limpiar</Text>
            </TouchableOpacity>
          )}
        </View>
        
        <View style={[
          styles.signatureWrapper,
          signatureError && styles.signatureError
        ]}>
          <Signature
            ref={sigRef}
            onOK={handleSignature}
            onEmpty={handleEmpty}
            onEnd={() => sigRef.current?.readSignature()}
            descriptionText=""
            clearText=""
            confirmText=""
            webStyle={style}
            autoClear={false}
            penColor="#083D56"
            backgroundColor="#FFFFFF"
          />
        </View>

        {signatureError ? (
          <Text style={styles.errorText}>{signatureError}</Text>
        ) : null}

        {signature && (
          <View style={styles.successMessage}>
            <Ionicons name="checkmark-circle" size={16} color="#10B981" />
            <Text style={styles.successText}>Firma capturada correctamente</Text>
          </View>
        )}

        <Text style={styles.hintText}>
          Presiona y desliza tu dedo para firmar en el área superior
        </Text>
      </View>

      {/* Botones de Acción */}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[
            styles.button, 
            styles.saveButton,
            (!signature || !customerName || isSaving) && styles.saveButtonDisabled
          ]}
          disabled={!signature || !customerName || isSaving}
          onPress={handleSave}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="checkmark-circle" size={20} color="white" />
          )}
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Guardando...' : 'Guardar Firma'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Soporte */}
      <View
        style={[
          styles.soporteFooter,
          { paddingBottom: insets.bottom + 20},
        ]}
      >
        <Text style={styles.soporteText}>
          <Text
            style={styles.soporteLink}
            onPress={() => navigation.navigate('TechnicalSupport', { orderId: order.id })}
          >
            Reportar un problema
          </Text>
        </Text>
      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  backButton: {
    paddingTop: 20,
    padding: 4,
  },
  titleContainer: {
    paddingTop: 20,
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#083D56',
    marginBottom: 4,
  },
  placeholder: {
    width: 40,
  },
  inputContainer: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  signatureContainer: {
    marginBottom: 30,
  },
  signatureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  clearButtonText: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '600',
  },
  signatureWrapper: {
    height: 200,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  signatureError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 14,
    fontWeight: '500',
  },
  successMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    gap: 8,
  },
  successText: {
    color: '#065F46',
    fontSize: 14,
    fontWeight: '600',
  },
  hintText: {
    color: '#6B7280',
    fontSize: 12,
    marginTop: 8,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#083D56',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  saveButton: {
    backgroundColor: '#083D56',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  soporteFooter: {
    marginTop: '50', 
    paddingTop: 50,
    width: '100%',
    alignItems: 'center',
  },
 soporteText: {
    textAlign: 'center',
    color: '#a2a2a2ff',
    fontSize: 15,
  },
  soporteLink: {
    fontWeight: 'bold',
  },
});