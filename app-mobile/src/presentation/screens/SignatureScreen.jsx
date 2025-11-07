import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Signature from 'react-native-signature-canvas';
import SignatureUseCase from '../../application/useCases/SignatureUseCase';
import SignatureRepositoryImpl from '../../infrastructure/repositories/SignatureRepositoryImpl';
import UpdateStatusUseCase from '../../application/useCases/UpdateStatusUseCase';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function SignatureScreen({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();
  const sigRef = useRef(null);

  const [customerName, setCustomerName] = useState('');
  const [signature, setSignature] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleSignature = (signatureResult) => {
    console.log('Firma recibida, longitud:', signatureResult?.length);
    setSignature(signatureResult);
  };

  const handleEmpty = () => {
    console.log('Firma vacía');
    setSignature(null);
  };

  const handleSave = async () => {
    if (!customerName.trim()) {
      Alert.alert('Error', 'Ingresa el nombre del cliente');
      return;
    }

    if (!signature) {
      Alert.alert('Error', 'Captura la firma primero');
      return;
    }

    try {
      setIsSaving(true);
      const useCaseSignature = new SignatureUseCase(new SignatureRepositoryImpl());
      await useCaseSignature.execute(order.id, signature);

      const useCaseStatus = new UpdateStatusUseCase(new HomeRepositoryImpl());
      await useCaseStatus.execute(order.id, 'Entregado');

      // 2. Limpiar AsyncStorage
      await AsyncStorage.removeItem('activeOrder');

      Alert.alert('Éxito', 'Firma guardada');
      navigation.navigate('MainContainer');
    } catch (error) {
      console.error('Error completo:', error);
      Alert.alert('Error', error.message || 'No se pudo guardar');
    } finally {
      setIsSaving(false);
    }
  };

  const style = `
    .m-signature-pad { box-shadow: none; border: none; }
    .m-signature-pad--body { border: 1px solid #CCC; }
    body, html { width: 100%; height: 100%; margin: 0; padding: 0; }
  `;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
        Capturar Firma - Pedido #{order.id}
      </Text>

      <Text>Nombre del cliente:</Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#CCC',
          padding: 10,
          marginBottom: 20,
          borderRadius: 5,
        }}
        placeholder="Nombre completo"
        value={customerName}
        onChangeText={setCustomerName}
      />

      <Text>Firma del cliente:</Text>
      <View style={{ height: 300, borderWidth: 1, borderColor: '#CCC', marginBottom: 20 }}>
        <Signature
          ref={sigRef}
          onOK={handleSignature}
          onEmpty={handleEmpty}
          onEnd={() => sigRef.current.readSignature()} // 👈 fuerza lectura automática
          descriptionText=""
          clearText="Limpiar"
          confirmText="Confirmar"
          webStyle={style}
        />
      </View>

      {signature && (
        <Text style={{ color: 'green', marginBottom: 10 }}>
          ✓ Firma capturada - Lista para guardar
        </Text>
      )}

      <View style={{ flexDirection: 'row', gap: 10 }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: '#CCC',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={() => navigation.goBack()}
        >
          <Text>Cancelar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: signature && customerName ? 'blue' : '#CCC',
            padding: 15,
            borderRadius: 5,
            alignItems: 'center',
          }}
          onPress={handleSave}
          disabled={!signature || !customerName || isSaving}
        >
          <Text style={{ color: 'white' }}>
            {isSaving ? 'Guardando...' : 'Guardar Firma'}
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ marginTop: 20, fontSize: 12, color: '#666' }}>
        Debug: {signature ? `Firma: ${signature.length} chars` : 'Sin firma'} | Nombre: {customerName || 'Vacío'}
      </Text>
    </View>
  );
}
