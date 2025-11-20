import React, { useState, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Alert, ScrollView } from 'react-native';
import MapRoute from '../components/MapRoute';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import UpdateStatusUseCase from '../../application/useCases/UpdateStatusUseCase';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';
import Toast from 'react-native-toast-message';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { height: screenHeight } = Dimensions.get('window');

export default function RouteMapOrderScreen({ route }) {
  const { orderData } = route.params;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets(); 
  
  const sheetRef = useRef(null);
  const [hasArrived, setHasArrived] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);

  // Alturas del BottomSheet
  const snapPoints = useMemo(() => ["30%", "90%"], []);

  // El MapRoute notifica cuando llegamos al destino
  const handleArrive = () => {
    console.log("📍 MapRoute notificó que llegó al destino");
    setHasArrived(true);
    
    Toast.show({
      type: 'success',
      text1: '¡Has llegado al destino!',
      text2: 'Presiona "Finalizar Viaje" para completar la entrega',
      position: 'top',
      visibilityTime: 4000,
    });
  };

  // función para finalizar el viaje
  const handleFinishTrip = async () => {
    try {
      setIsFinalizing(true);
      
      Toast.show({
        type: 'info',
        text1: 'Finalizando viaje...',
        position: 'top',
      });
      
      setTimeout(() => {
        navigation.navigate('DetailsOrder', { 
          order: orderData 
        });
      }, 2000);
      
    } catch (error) {
      console.error('Error al finalizar viaje:', error);
      
      Toast.show({
        type: 'error',
        text1: 'Error al finalizar viaje',
        text2: 'Intenta nuevamente',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCancelOrder = async () => {
    Alert.alert(
      "Cancelar Viaje",
      "¿Estás seguro de que quieres cancelar este viaje?",
      [
        {
          text: "No",
          style: "cancel"
        },
        {
          text: "Sí, cancelar",
          onPress: async () => {
            try {
              const useCase = new UpdateStatusUseCase(new HomeRepositoryImpl());
              await useCase.execute(orderData.id, 'Pendiente');
              
              await AsyncStorage.removeItem('activeOrder');
              Toast.show({
                type: 'success',
                text1: 'Viaje cancelado',
                text2: 'El pedido ha sido cancelado',
                position: 'top',
                visibilityTime: 3000,
              });
              
              setTimeout(() => {
                navigation.goBack();
              }, 3000);
              
            } catch (error) {
              console.error('Error al cancelar el pedido:', error);
              
              Toast.show({
                type: 'error',
                text1: 'Error al cancelar',
                text2: 'No se pudo cancelar el viaje',
                position: 'bottom',
                visibilityTime: 4000,
              });
            }
          }
        }
      ]
    );
  };

  const order = orderData || {};
  
  // Construir el objeto destino para MapRoute
  const destination = {
    latitud: order.latitud,
    longitud: order.longitud,
    //calle: order.calle || "Con dirección",
    //ciudad: order.ciudad || "Conocida",
    //numero: order.numero || "S/N", 
    //codigoPostal: order.codigoPostal || "11111",
    //colonia: order.colonia || "Conocida",
    //estado: order.estado || "Conocida"
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-MX', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return dateString;
    }
  };

  // Formatear moneda
  const formatCurrency = (amount) => {
    return `$${amount?.toLocaleString('es-MX') || '0'}`;
  };

  return (
    <View style={styles.container}>
      {/* --- MAPA --- */}
      <View style={styles.mapContainer}>
        <MapRoute 
          onArrive={handleArrive}
          destino={destination}
        />
      </View>

      {/* --- BOTTOM SHEET CON TODA LA INFORMACIÓN --- */}
      <BottomSheet
        ref={sheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={false}
        handleIndicatorStyle={styles.handle}
        backgroundStyle={styles.cardBackground}
        style={styles.bottomSheet}
      >
        <BottomSheetView style={[styles.contentContainer,  { paddingBottom: insets.bottom + 20 }]}>
          <ScrollView 
            style={styles.scrollContent}
            showsVerticalScrollIndicator={true}
            contentContainerStyle={styles.scrollContainer}
          >
            {/* Header con botones de acción */}
            <View style={styles.headerContainer}>
              <TouchableOpacity style={styles.backButton} onPress={handleBack}>
                <Ionicons name="arrow-back" size={18} color="#083D56" />
                <Text style={styles.backText}>Volver</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancelOrder}
                disabled={hasArrived}
              >
                <Ionicons name="close-circle-outline" size={16} color={hasArrived ? "#9CA3AF" : "#EF4444"} />
                <Text style={[styles.cancelText, hasArrived && styles.disabledText]}>
                  Cancelar
                </Text>
              </TouchableOpacity>
            </View>

            {/* ID del Pedido y Estatus */}
            <View style={styles.orderIdContainer}>
              <View style={styles.orderIdSection}>
                <Text style={styles.orderLabel}>PEDIDO</Text>
                <Text style={styles.orderId}>#{order.id || 'N/A'}</Text>
              </View>
              <View style={[
                styles.statusBadge, 
                { 
                  backgroundColor: hasArrived ? '#D1FAE5' : '#E0F2FE'
                }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { color: hasArrived ? '#065F46' : '#0369A1' }
                ]}>
                  {hasArrived ? 'EN DESTINO' : 'EN CAMINO'}
                </Text>
              </View>
            </View>

            {/* Información básica siempre visible */}
            <View style={styles.basicInfoContainer}>
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="business-outline" size={14} color="#6B7280" />
                  <Text style={styles.label}>Sucursal:</Text>
                </View>
                <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                  {order.sucursal || 'No especificada'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="cube-outline" size={14} color="#6B7280" />
                  <Text style={styles.label}>Producto:</Text>
                </View>
                <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                  {order.producto || 'N/A'}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <View style={styles.labelContainer}>
                  <Ionicons name="person-outline" size={14} color="#6B7280" />
                  <Text style={styles.label}>Encargado:</Text>
                </View>
                <Text style={styles.value} numberOfLines={1} ellipsizeMode="tail">
                  {order.nombreEncargado || 'No especificado'}
                </Text>
              </View>
            </View>

            {/* Información detallada del pedido */}
            <View style={styles.detailedSection}>
              <View style={styles.detailGrid}>
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailLabel}>Fecha del pedido:</Text>
                  </View>
                  <Text style={styles.detailValue}>{formatDate(order.fechaHora)}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="stats-chart-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailLabel}>Cantidad:</Text>
                  </View>
                  <Text style={styles.detailValue}>{order.cantidad || '0'} kg</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="cash-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailLabel}>Total:</Text>
                  </View>
                  <Text style={[styles.detailValue, styles.totalText]}>
                    {formatCurrency(order.total)}
                  </Text>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="business-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailLabel}>Empresa:</Text>
                  </View>
                  <Text style={styles.detailValue}>{order.empresa || 'N/A'}</Text>
                </View>
                
                <View style={styles.detailItem}>
                  <View style={styles.detailLabelContainer}>
                    <Ionicons name="document-text-outline" size={14} color="#6B7280" />
                    <Text style={styles.detailLabel}>Estatus:</Text>
                  </View>
                  <View style={styles.statusDetail}>
                    <Text style={styles.detailValue}>{order.estatusGeneral || 'N/A'}</Text>
                  </View>
                </View>
              </View>
            </View>
            
            {/* Dirección de entrega */}
            <View style={styles.addressSection}>
              <View style={styles.addressHeader}>
                <Ionicons name="location-outline" size={16} color="#374151" />
                <Text style={styles.addressTitle}>Dirección de entrega</Text>
              </View>
              <Text style={styles.addressText} numberOfLines={2}>
                {`${order.calle || ''} ${order.numero || ''}, ${order.colonia || ''}`}
              </Text>
              <Text style={styles.addressCity} numberOfLines={1}>
                {`CP ${order.codigoPostal || ''}, ${order.ciudad || ''}, ${order.estado || ''}`}
              </Text>
            </View>

            {/* Contenido dinámico - Botón de finalizar o indicador de distancia */}
            {hasArrived ? (
              <View>
                <View style={styles.arrivedMessage}>
                  <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                  <Text style={styles.arrivedText}>¡Has llegado al destino!</Text>
                </View>
                <TouchableOpacity 
                  style={[styles.btnFinish, isFinalizing && styles.btnDisabled]}
                  onPress={handleFinishTrip}
                  disabled={isFinalizing}
                >
                  {isFinalizing ? (
                    <View style={styles.loadingContainer}>
                      <Text style={styles.btnText}>FINALIZANDO...</Text>
                    </View>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle" size={20} color="white" />
                      <Text style={styles.btnText}>FINALIZAR VIAJE</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.distanceHint}>
                <Ionicons name="navigate" size={14} color="#083D56" />
                <Text style={styles.distanceHintText}>
                  Acércate a menos de 30 metros para finalizar
                </Text>
              </View>
            )}

          </ScrollView>
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F3F4",
  },
  mapContainer: {
    width: '100%',
    height: screenHeight * 0.85,
  },
  bottomSheet: {
  },
  handle: {
    backgroundColor: "#083D56",
    width: 40,
    height: 4,
    borderRadius: 2,
    marginTop: 8,
    marginBottom: 4,
  },
  cardBackground: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  contentContainer: {
    flex: 1,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  backText: {
    color: '#083D56',
    fontWeight: '600',
    fontSize: 13,
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 6,
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  cancelText: {
    color: '#EF4444',
    fontWeight: '600',
    fontSize: 13,
  },
  disabledText: {
    color: '#9CA3AF',
  },
  orderIdContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  orderIdSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  orderLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#083D56',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  basicInfoContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  addressSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#083D56',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  addressText: {
    fontSize: 13,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 18,
    fontWeight: '500',
  },
  addressCity: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  detailedSection: {
    marginBottom: 12,
  },
  detailGrid: {
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    padding: 12,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  detailLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flex: 1,
  },
  detailLabel: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 13,
    color: '#1F2937',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
  },
  totalText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#065F46',
  },
  statusDetail: {
    alignItems: 'flex-end',
  },
  arrivedMessage: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  arrivedText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#065F46',
  },
  btnFinish: {
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
  btnDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  distanceHint: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#EFF6FF',
    borderRadius: 8,
    gap: 8,
  },
  distanceHintText: {
    fontSize: 12,
    color: '#083D56',
    fontWeight: '500',
    flex: 1,
  }
});