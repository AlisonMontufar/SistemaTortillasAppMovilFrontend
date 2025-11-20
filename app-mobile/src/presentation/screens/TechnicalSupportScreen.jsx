import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message'; //Mensaje global
import AsyncStorage from '@react-native-async-storage/async-storage';
import UpdateStatusUseCase from '../../application/useCases/UpdateStatusUseCase';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';

// Hook de validación
import { useSupportValidation } from '../../application/hooks/useSupportValidation';

export default function TechnicalSupportScreen() {
  const route = useRoute();
  const { orderId } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [incidentReason, setIncidentReason] = useState('');
  const [problemDescription, setProblemDescription] = useState('');
  const [contactMethod, setContactMethod] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hook de validaciones
  const {
    incidentReasonError,
    problemDescriptionError,
    contactMethodError,
    emailError,
    validateFields,
    validateField,
    resetErrors
  } = useSupportValidation(incidentReason, problemDescription, contactMethod, email);

  // Opciones para los selects
  const incidentReasons = [
    { label: 'Selecciona un motivo', value: '' },
    { label: 'Problema con la entrega', value: 'delivery_issue' },
    { label: 'Producto dañado', value: 'damaged_product' },
    { label: 'Falta de producto', value: 'missing_product' },
    { label: 'Error en el pedido', value: 'order_error' },
    { label: 'Problema con el pago', value: 'payment_issue' },
    { label: 'Problema con la aplicación', value: 'app_issue' },
    { label: 'Otro', value: 'other' }
  ];

  const contactMethods = [
    { label: 'Selecciona medio de contacto', value: '' },
    { label: 'Correo electrónico', value: 'email' }
  ];

  const handleSubmit = async () => {
    resetErrors();

    if (!validateFields()) {
      Alert.alert('Error', 'Revisa los campos marcados en rojo');
      return;
    }

    try {
      setIsSubmitting(true);

      // Aquí iría la lógica para enviar el reporte al backend
      const reportData = {
        orderId,
        incidentReason,
        problemDescription,
        contactMethod,
        email: contactMethod === 'email' ? email : null,
        timestamp: new Date().toISOString()
      };

      console.log('Datos del reporte:', reportData);

      // Simular envío
      await new Promise(resolve => setTimeout(resolve, 2000));


      // Cambiar estatus del pedido
      const useCaseStatus = new UpdateStatusUseCase(new HomeRepositoryImpl());
      await useCaseStatus.execute(orderId, 'Pendiente');

      // Limpiar pedido activo
      await AsyncStorage.removeItem('activeOrder');

      // ✅ Toast de éxito
      Toast.show({
        type: 'error',
        text1: 'Reporte Enviado',
        text2: ' Nos pondremos en contacto contigo pronto.',
        position: 'top',
      });

      navigation.navigate('MainContainer');

    } catch (error) {
      console.error(error);
      
      // ❌ Toast de error
      Toast.show({
        type: 'error',
        text1: 'Error al mandar el Reporte',
        text2: error.message || 'Intenta nuevamente',
        position: 'top',
      });

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#083D56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Soporte Técnico</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tarjeta Principal */}
        <View style={styles.card}>
          {/* Información del Pedido */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN DEL PEDIDO</Text>
            <View style={styles.orderInfo}>
              <Ionicons name="document-text" size={20} color="#083D56" />
              <Text style={styles.orderId}>Pedido #{orderId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Motivo del Incidente */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MOTIVO DEL INCIDENTE *</Text>
            <View style={[
              styles.pickerContainer,
              incidentReasonError && styles.inputError
            ]}>
              <Picker
                selectedValue={incidentReason}
                onValueChange={(value) => {
                  setIncidentReason(value);
                  validateField('incidentReason', value);
                }}
                style={styles.picker}
                dropdownIconColor="#6B7280"
              >
                {incidentReasons.map((reason) => (
                  <Picker.Item 
                    key={reason.value} 
                    label={reason.label} 
                    value={reason.value} 
                  />
                ))}
              </Picker>
            </View>
            {incidentReasonError ? (
              <Text style={styles.errorText}>{incidentReasonError}</Text>
            ) : null}
          </View>

          {/* Descripción del Problema */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DESCRIPCIÓN DEL PROBLEMA *</Text>
            <TextInput
              style={[
                styles.textArea,
                problemDescriptionError && styles.inputError
              ]}
              placeholder="Describe detalladamente el problema que has experimentado..."
              value={problemDescription}
              onChangeText={(text) => {
                setProblemDescription(text);
                validateField('problemDescription', text);
              }}
              onBlur={() => validateField('problemDescription', problemDescription)}
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
            {problemDescriptionError ? (
              <Text style={styles.errorText}>{problemDescriptionError}</Text>
            ) : null}
          </View>

          {/* Medio de Contacto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>MEDIO DE CONTACTO *</Text>
            <View style={[
              styles.pickerContainer,
              contactMethodError && styles.inputError
            ]}>
              <Picker
                selectedValue={contactMethod}
                onValueChange={(value) => {
                  setContactMethod(value);
                  validateField('contactMethod', value);
                }}
                style={styles.picker}
                dropdownIconColor="#6B7280"
              >
                {contactMethods.map((method) => (
                  <Picker.Item 
                    key={method.value} 
                    label={method.label} 
                    value={method.value} 
                  />
                ))}
              </Picker>
            </View>
            {contactMethodError ? (
              <Text style={styles.errorText}>{contactMethodError}</Text>
            ) : null}

            {/* Campo de email solo si se selecciona correo electrónico */}
            {contactMethod === 'email' && (
              <View style={styles.emailContainer}>
                <Text style={styles.emailLabel}>Correo electrónico *</Text>
                <TextInput
                  style={[
                    styles.input,
                    emailError && styles.inputError
                  ]}
                  placeholder="tu@email.com"
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    validateField('email', text);
                  }}
                  onBlur={() => validateField('email', email)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
                {emailError ? (
                  <Text style={styles.errorText}>{emailError}</Text>
                ) : null}
              </View>
            )}
          </View>

          {/* Adjuntar Evidencia */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ADJUNTAR EVIDENCIA (OPCIONAL)</Text>
            <TouchableOpacity style={styles.attachButton}>
              <Ionicons name="attach" size={20} color="#6B7280" />
              <Text style={styles.attachButtonText}>Adjuntar archivos</Text>
            </TouchableOpacity>
            <Text style={styles.attachHint}>
              Esta función estará disponible próximamente
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Botón de Enviar */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            isSubmitting && styles.submitButtonDisabled
          ]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Ionicons name="send" size={20} color="white" />
          )}
          <Text style={styles.submitButtonText}>
            {isSubmitting ? 'ENVIANDO...' : 'ENVIAR REPORTE'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    paddingTop: 20,
    fontSize: 18,
    fontWeight: '700',
    color: '#083D56',
  },
  backButton: {
    paddingTop: 20,
    padding: 4,
  },
  headerPlaceholder: {
    width: 32,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F9FF',
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#083D56',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    backgroundColor: 'white',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 2,
  },
  errorText: {
    color: '#EF4444',
    marginTop: 6,
    fontSize: 12,
    fontWeight: '500',
  },
  emailContainer: {
    marginTop: 12,
  },
  emailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  attachButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    borderStyle: 'dashed',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  attachButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '500',
  },
  attachHint: {
    color: '#9CA3AF',
    fontSize: 12,
    marginTop: 8,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  submitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#083D56',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#083D56',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});