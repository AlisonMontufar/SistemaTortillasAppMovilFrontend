import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import HomeUseCase from '../../application/useCases/HomeUseCase';
import HomeRepositoryImpl from '../../infrastructure/repositories/HomeRepositoryImpl';
import OrdersList from './OrdersList'; // 👈 nuevo import

const { width } = Dimensions.get('window');
const GRID_PADDING = 30;
const CARD_SPACING = 30;
const CARD_WIDTH = (width - GRID_PADDING * 2 - CARD_SPACING) / 2;

const EnterpriseCard = React.memo(({ item, onPress }) => {
  const pedidosText = `${item.numeroPedidos} Pedido${item.numeroPedidos !== 1 ? 's' : ''} pendiente${item.numeroPedidos !== 1 ? 's' : ''}`;

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => onPress(item)}
    >
      <View style={styles.logoContainer}>
        <Image source={{ uri: item.logo }} style={styles.logo} resizeMode="contain" />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.ordersText}>{pedidosText}</Text>
      </View>
    </TouchableOpacity>
  );
});

export default function EnterpriseGrid() {
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEnterprise, setSelectedEnterprise] = useState(null); // 👈 para ver pedidos

  useEffect(() => {
    const fetchEnterprises = async () => {
      setLoading(true);
      setError(null);
      try {
        const useCase = new HomeUseCase(new HomeRepositoryImpl());
        const apiData = await useCase.execute();
        setEnterprises(apiData);
      } catch (e) {
        console.error('Error al obtener las empresas:', e);
        setError('No se pudieron cargar los clientes. Inténtalo de nuevo.');
      } finally {
        setLoading(false);
      }
    };
    fetchEnterprises();
  }, []);

  const handlePressCard = (enterprise) => {
    setSelectedEnterprise(enterprise); // 👈 renderiza la lista de pedidos
  };

  const handleBack = () => {
    setSelectedEnterprise(null); // 👈 regresa al grid
  };

  if (selectedEnterprise) {
    return (
      <OrdersList
        enterpriseId={selectedEnterprise.id}
        onBack={handleBack}
      />
    );
  }

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#FF9800" />
        <Text style={styles.loaderText}>Cargando clientes...</Text>
      </View>
    );
  }

  if (error && enterprises.length === 0) {
    return (
      <View style={styles.loaderContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <Text style={styles.retryText}>Asegúrate de tener conexión a internet.</Text>
      </View>
    );
  }

  const renderItem = ({ item }) => <EnterpriseCard item={item} onPress={handlePressCard} />;

  return (
    <View style={styles.container}>
      {error && enterprises.length > 0 && (
        <View style={styles.alertContainer}>
          <Text style={styles.alertText}>⚠️ No se pudieron actualizar los datos.</Text>
        </View>
      )}

      <FlatList
        data={enterprises}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  listContent: {
    paddingHorizontal: GRID_PADDING,
    paddingVertical: 16,
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: CARD_SPACING,
  },
  card: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  logoContainer: {
    width: '80%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  textContainer: {
    alignItems: 'center',
    width: '100%',
  },
  ordersText: {
    fontSize: 13,
    color: '#7f8c8d',
    textAlign: 'center',
    fontWeight: '500',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 40,
  },
  loaderText: {
    marginTop: 12,
    color: '#666',
    fontSize: 16,
  },
  errorText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 8,
  },
  retryText: {
    fontSize: 14,
    color: '#95a5a6',
    textAlign: 'center',
    lineHeight: 20,
  },
  alertContainer: {
    backgroundColor: '#fff8e1',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ffe0b2',
  },
  alertText: {
    textAlign: 'center',
    color: '#e65100',
    fontWeight: '500',
    fontSize: 14,
  },
});
