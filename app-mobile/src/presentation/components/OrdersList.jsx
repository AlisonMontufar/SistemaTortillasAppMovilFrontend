import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect  } from '@react-navigation/native';
import OrderDetailUseCase from '../../application/useCases/OrderDetailUseCase';
import Toast from 'react-native-toast-message';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';
import UpdateStatusUseCase from '../../application/useCases/UpdateStatusUseCase';

export default function OrdersList({ enterpriseId, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeOrderExists, setActiveOrderExists] = useState(false);
  const [activeOrderData, setActiveOrderData] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        // Verificar si existe un pedido activo en AsyncStorage
        const storedActiveOrder = await AsyncStorage.getItem('activeOrder');
        if (storedActiveOrder) {
          const orderData = JSON.parse(storedActiveOrder);
          setActiveOrderExists(true);
          setActiveOrderData(orderData);
        } else {
          setActiveOrderExists(false);
          setActiveOrderData(null);
        }

        // Cargar los pedidos
        const useCase = new OrderDetailUseCase(new HomeRepositoryImpl());
        const apiData = await useCase.execute(enterpriseId);
        console.log(apiData);
        setOrders(apiData);
      } catch (err) {
        console.error(err);
        Toast.show({
          type: 'error',
          text1: 'Error al cargar pedidos',
          text2: err.message || 'Intenta nuevamente más tarde',
          position: 'top',
        });
      } finally {
        setLoading(false);
      }
    };

    initializeData();
  }, [enterpriseId]);

  const handleStartOrder = async (item) => {
    try {
      // Guardar el pedido activo en AsyncStorage
      const activeOrderData = {
        id: item.id,
        estatusDetalle: 'En camino',
        fechaInicio: new Date().toISOString(),
        enterpriseId: enterpriseId,
        ...item
      };
      
      await AsyncStorage.setItem('activeOrder', JSON.stringify(activeOrderData));
      setActiveOrderExists(true);
      setActiveOrderData(activeOrderData);
      
      Toast.show({
        type: 'success',
        text1: 'Viaje iniciado',
        text2: `Pedido #${item.id} está en camino`,
        position: 'top',
      });

      //Actualiza el estatus del pedido a En camino
      const useCase = new UpdateStatusUseCase(new HomeRepositoryImpl());
      const infoUpdate = await useCase.execute(item.id, 'En camino');

      console.log(infoUpdate);

      // Navegar a la siguiente vista con los datos del pedido
      navigation.navigate('RouterMapOrder', { 
        orderData: activeOrderData 
      });

    } catch (error) {
      console.error('Error al iniciar viaje:', error);
      Toast.show({
        type: 'error',
        text1: 'Error al iniciar viaje',
        text2: 'Intenta nuevamente',
        position: 'top',
      });
    }
  };

  const handleContinueActiveOrder = () => {
    if (activeOrderData) {
      // Navegar a la vista de entrega con los datos del pedido activo
      navigation.navigate('RouterMapOrder', { 
        orderData: activeOrderData 
      });
    }
  };

  const getButtonConfig = (item) => {
    const isPending = item.estatusDetalle === 'Pendiente';
    const isActiveOrder = activeOrderData && activeOrderData.id === item.id;
    
    // Si este es el pedido activo, permitir continuar
    if (isActiveOrder) {
      return {
        text: 'CONTINUAR VIAJE',
        onPress: handleContinueActiveOrder,
        disabled: false,
        style: styles.activeButton
      };
    }
    
    // Si ya existe un pedido activo pero no es este, deshabilitar
    if (activeOrderExists && !isActiveOrder) {
      return {
        text: 'VIAJE EN CURSO',
        onPress: null,
        disabled: true,
        style: styles.disabledButton
      };
    }

    // Si no hay pedido activo y este está pendiente, habilitar
    if (isPending && !activeOrderExists) {
      return {
        text: 'INICIAR VIAJE',
        onPress: () => handleStartOrder(item),
        disabled: false,
        style: styles.actionButton
      };
    }

    // Para cualquier otro caso
    return {
      text: 'NO DISPONIBLE',
      onPress: null,
      disabled: true,
      style: styles.disabledButton
    };
  };

  const getStatusConfig = (estatusGeneral, estatusDetalle) => {
    const statusConfig = {
      general: {
        color: '#6B7280',
        icon: '⏳'
      },
      detail: {
        color: '#6B7280',
        icon: '📦'
      }
    };

    if (estatusGeneral === 'Pagado') {
      statusConfig.general = { color: '#10B981', icon: '✅' };
    } else if (estatusGeneral === 'Pendiente') {
      statusConfig.general = { color: '#F59E0B', icon: '⏳' };
    } else {
      statusConfig.general = { color: '#EF4444', icon: '❌' };
    }

    if (estatusDetalle === 'Pendiente') {
      statusConfig.detail = { color: '#F59E0B', icon: '🕒' };
    } else if (estatusDetalle === 'En camino') {
      statusConfig.detail = { color: '#3B82F6', icon: '🚚' };
    } else {
      statusConfig.detail = { color: '#10B981', icon: '📦' };
    }

    return statusConfig;
  };

  const formatAddress = (item) => {
    return `${item.calle} ${item.numero}, ${item.colonia}, CP ${item.codigoPostal}`;
  };

  const renderItem = ({ item }) => {
    const fecha = new Date(item.fechaHora);
    const fechaFormateada = fecha.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const horaFormateada = fecha.toLocaleTimeString('es-MX', {
      hour: '2-digit',
      minute: '2-digit',
    });

    const statusConfig = getStatusConfig(item.estatusGeneral, item.estatusDetalle);
    const buttonConfig = getButtonConfig(item);

    return (
      <View style={styles.card}>
        {/* Header con ID y estatus */}
        <View style={styles.cardHeader}>
          <View style={styles.orderIdContainer}>
            <Text style={styles.orderIcon}>📦</Text>
            <Text style={styles.orderId}>Pedido #{item.id}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: `${statusConfig.general.color}15` }]}>
            <Text style={[styles.statusText, { color: statusConfig.general.color }]}>
              {statusConfig.general.icon} {item.estatusGeneral}
            </Text>
          </View>
        </View>

        {/* Estatus de detalle */}
        <View style={styles.detailStatusContainer}>
          <Text style={[styles.detailStatus, { color: statusConfig.detail.color }]}>
            {statusConfig.detail.icon} {item.estatusDetalle}
          </Text>
        </View>

        {/* Información principal */}
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            <Ionicons name="person-outline" size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Encargado:</Text>
            <Text style={styles.infoValue}>{item.nombreEncargado}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Sucursal:</Text>
            <Text style={styles.infoValue}>{item.sucursal}</Text>
          </View>

          <View style={styles.infoRow}>
            <Ionicons name="time-outline" size={16} color="#6B7280" />
            <Text style={styles.infoLabel}>Fecha:</Text>
            <Text style={styles.infoValue}>
              {fechaFormateada} a las {horaFormateada} hrs
            </Text>
          </View>
        </View>

        {/* Dirección */}
        <View style={styles.addressContainer}>
          <View style={styles.addressHeader}>
            <Ionicons name="location-outline" size={16} color="#374151" />
            <Text style={styles.addressTitle}>Dirección de entrega</Text>
          </View>
          <Text style={styles.addressText}>{formatAddress(item)}</Text>
          <Text style={styles.addressCity}>
            {item.ciudad}, {item.estado}
          </Text>
        </View>

        {/* Botón de acción */}
        <TouchableOpacity 
          style={buttonConfig.style}
          onPress={buttonConfig.onPress}
          disabled={buttonConfig.disabled}
        >
          <Text style={styles.buttonText}>
            {buttonConfig.text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#083D56" />
        <Text style={styles.loadingText}>Cargando pedidos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#083D56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lista de Pedidos</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Banner informativo si hay viaje activo */}
      {activeOrderExists && activeOrderData && (
        <View style={styles.activeOrderBanner}>
          <Ionicons name="information-circle" size={20} color="#083D56" />
          <Text style={styles.activeOrderText}>
            Tienes un viaje en curso: Pedido #{activeOrderData.id}
          </Text>
        </View>
      )}

      {/* Lista de pedidos */}
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay pedidos disponibles</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1,
    backgroundColor: '#F9FAFB'
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#083D56',
  },
  backButton: {
    padding: 4,
  },
  headerPlaceholder: {
    width: 32,
  },
  activeOrderBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#083D56',
  },
  activeOrderText: {
    marginLeft: 8,
    color: '#083D56',
    fontWeight: '500',
    fontSize: 14,
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  orderIdContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  orderIcon: {
    marginRight: 8,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailStatusContainer: {
    marginBottom: 16,
  },
  detailStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoContainer: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
    marginLeft: 8,
    marginRight: 4,
    width: 80,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    flex: 1,
  },
  addressContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#083D56',
  },
  addressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginLeft: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 4,
    lineHeight: 20,
  },
  addressCity: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  actionButton: {
    backgroundColor: '#083D56',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#083D56',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activeButton: {
    backgroundColor: '#083D56',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    shadowColor: '#083D56',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: '#F9FAFB'
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
});