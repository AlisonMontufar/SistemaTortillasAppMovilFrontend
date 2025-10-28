import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

export default function OrdersList({ enterpriseId, onBack }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);

        // 🔹 API simulada (reemplázala por tu URL real)
        const response = await fetch(`http://192.168.100.10:5149/api/v1/Sucursal/empresa/${enterpriseId}`);
        // Si aún no tienes backend, usa datos de prueba:
        // const data = [
        //   { id: 10050, status: 'Pendiente', destino: 'Sucursal Centro', ubicacion: 'Res. Olivos', recibe: 'Emanuel Mancilla', hora: '14:00' },
        //   { id: 10051, status: 'Pendiente', destino: 'Sucursal Norte', ubicacion: 'Col. Roma', recibe: 'Ana Torres', hora: '15:30' },
        //   { id: 10052, status: 'Pendiente', destino: 'Sucursal Sur', ubicacion: 'Av. Central', recibe: 'Carlos Pérez', hora: '16:00' },
        // ];
        const data = await response.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
        setError('Error al cargar los pedidos');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [enterpriseId]);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.orderId}>#{item.id}</Text>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      <Text style={styles.title}>Entrega a {item.destino}</Text>
      <Text style={styles.subtitle}>Ubicación: {item.ubicacion}</Text>
      <Text style={styles.subtitle}>Recibe: {item.recibe}</Text>

      <View style={styles.footerRow}>
        <Text style={styles.time}>Hora aproximada: {item.hora} Hrs</Text>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>INICIAR PEDIDO</Text>
      </TouchableOpacity>
    </View>
  );

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text>Cargando pedidos...</Text>
      </View>
    );

  if (error)
    return (
      <View style={styles.center}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBack} style={styles.backButton}>
        <Text style={styles.backText}>← Volver</Text>
      </TouchableOpacity>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f6f6' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  orderId: {
    fontWeight: '700',
    color: '#000',
  },
  status: {
    color: '#777',
    fontWeight: '600',
  },
  title: {
    fontWeight: '600',
    marginTop: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 2,
  },
  footerRow: {
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  time: {
    color: '#444',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#083D56',
    borderRadius: 6,
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },
  backButton: {
    padding: 10,
  },
  backText: {
    color: '#083D56',
    fontWeight: '600',
    fontSize: 15,
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
