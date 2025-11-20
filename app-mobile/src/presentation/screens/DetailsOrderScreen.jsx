import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context'; 

export default function DetailsOrderScreen({ route }) {
  const { order } = route.params;
  const navigation = useNavigation();

  const insets = useSafeAreaInsets(); 

  const handleConfirmDelivery = () => {
    navigation.navigate('Signature', {order: order })
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-MX', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#083D56" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detalles del Pedido</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Tarjeta Principal - Estilo Recibo */}
        <View style={styles.receiptCard}>
          {/* Encabezado del Recibo */}
          <View style={styles.receiptHeader}>
            <Ionicons name="receipt" size={32} color="#083D56" />
            <Text style={styles.receiptTitle}>COMPROBANTE DE PEDIDO</Text>
            <View style={[styles.statusBadge, 
              { backgroundColor: order.estatusGeneral === 'Pagado' ? '#D1FAE5' : '#FEF3C7' }]}>
              <Text style={[styles.statusText, 
                { color: order.estatusGeneral === 'Pagado' ? '#065F46' : '#083D56' }]}>
                {order.estatusGeneral || 'Pendiente'}
              </Text>
            </View>
          </View>

          {/* Línea divisoria */}
          <View style={styles.divider} />

          {/* Información del Pedido */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN DEL PEDIDO</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Número de Pedido:</Text>
              <Text style={styles.value}>#{order.id || 'N/A'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Fecha y Hora:</Text>
              <Text style={styles.value}>{formatDate(order.fechaHora)}</Text>
            </View>
          </View>

          {/* Información de la Empresa */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>INFORMACIÓN DE LA EMPRESA</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Empresa:</Text>
              <Text style={styles.value}>{order.empresa || 'No especificada'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Sucursal:</Text>
              <Text style={styles.value}>{order.sucursal || 'No especificada'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Encargado:</Text>
              <Text style={styles.value}>{order.nombreEncargado || 'No asignado'}</Text>
            </View>
          </View>

          {/* Información del Producto */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DETALLES DEL PRODUCTO</Text>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Producto:</Text>
              <Text style={styles.value}>{order.producto || 'No especificado'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.label}>Cantidad:</Text>
              <Text style={styles.value}>{order.cantidad || 'N/A'}</Text>
            </View>
          </View>

          {/* Dirección de Entrega */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>DIRECCIÓN DE ENTREGA</Text>
            <View style={styles.addressCard}>
              <View style={styles.addressRow}>
                <Ionicons name="location" size={16} color="#6B7280" />
                <Text style={styles.addressText}>
                  {order.calle || 'Calle no especificada'} {order.numero || ''}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="business" size={16} color="#6B7280" />
                <Text style={styles.addressText}>
                  {order.colonia || 'Colonia no especificada'}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="navigate" size={16} color="#6B7280" />
                <Text style={styles.addressText}>
                  {order.ciudad || 'Ciudad no especificada'}, {order.estado || 'Estado no especificado'}
                </Text>
              </View>
              <View style={styles.addressRow}>
                <Ionicons name="mail" size={16} color="#6B7280" />
                <Text style={styles.addressText}>
                  CP: {order.codigoPostal || 'No especificado'}
                </Text>
              </View>
            </View>
          </View>

          {/* Información Adicional */}
          {(order.observaciones || order.notas) && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>INFORMACIÓN ADICIONAL</Text>
              <View style={styles.notesCard}>
                <Text style={styles.notesText}>
                  {order.observaciones || order.notas || ''}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Botón de Acción */}
      <View style={[styles.footer, { paddingBottom: insets.bottom + 20}]}>
        <TouchableOpacity 
          style={styles.confirmButton}
          onPress={handleConfirmDelivery}
        >
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.confirmButtonText}>CONFIRMAR ENTREGA</Text>
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
  receiptCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  receiptHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  receiptTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#083D56',
    marginTop: 8,
    marginBottom: 12,
    textAlign: 'center',
  },
  statusBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
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
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingVertical: 4,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
    flex: 1,
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  addressCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#083D56',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
    flex: 1,
  },
  notesCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  notesText: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '500',
    lineHeight: 20,
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
  confirmButton: {
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
  confirmButtonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});