import HomeRepository from '../../domain/repositories/HomeRepository';
import Enterprise from '../../domain/entities/Enterprise';
import OrderDatails from '../../domain/entities/OrderDatails';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default class HomeRepositoryImpl extends HomeRepository {
  constructor() {
    super();
    this.apiEnterprisesBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Empresa';
    this.apiOrdersDetailsBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Pedidos/Empresa/';
    this.apiUpdateStatusBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Pedidos/detalle/estatusporpedido'
  }

  async enterprises() {
    try {
      const response = await fetch(this.apiEnterprisesBaseUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Error al obtener las Empresas');
      }

      const enterprisesData = await response.json();

      // Mapea cada empresa al modelo Enterprise
      const enterprises = enterprisesData.map(
        (item) =>
          new Enterprise(
            item.id,
            item.nombreEmpresa,
            item.logo,
            item.fechaRegistro,
            item.estatus,
            item.numeroPedidos
          )
      )
      .filter((enterprise) => enterprise.numeroPedidos > 0); // solo las Empresas que tienen pedidos

      console.log('Empresas con pedidos: ', enterprises);
      return enterprises;
    } catch (error) {
      throw new Error(error.message || 'Error al conectar con la API');
    }
  }

  async OrdersEnterprises(IdEnterprise) {
  try {
    const response = await fetch(`${this.apiOrdersDetailsBaseUrl}${IdEnterprise}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error('Error al obtener los pedidos de las Empresas');
    }

    const Orders = await response.json();

    // 🔹 Intentar obtener el pedido activo guardado localmente
    let activeOrderId = null;
    try {
      const activeOrderData = await AsyncStorage.getItem('activeOrder');
      console.log('localstorage',activeOrderData);
      if (activeOrderData) {
        const activeOrder = JSON.parse(activeOrderData);
        activeOrderId = activeOrder?.id;
      }
    } catch (err) {
      console.warn('⚠️ No se pudo obtener activeOrder del AsyncStorage:', err);
    }

    // 🔹 Mapear pedidos a la entidad
    const OrdersDetails = Orders.map(
      (item) =>
        new OrderDatails(
          item.id,
          item.idPedido,
          item.empresa,
          item.nombreEncargado,
          item.sucursal,
          item.estatusGeneral,
          item.estatusDetalle,
          item.fechaHora,
          item.cantidad,
          item.total,
          item.producto,
          item.calle,
          item.numero,
          item.colonia,
          item.codigoPostal,
          item.ciudad,
          item.estado
        )
    );
 
    // 🔹 Filtrar pedidos
    const filteredOrders = OrdersDetails.filter((order) => {
      if (!activeOrderId) {
        // Si no hay pedido activo, mostrar solo los pendientes
        return order.estatusDetalle === 'Pendiente';
      }
      // Si hay pedido activo, mostrar pendientes + el que está "En camino" y coincide
      return (
        order.estatusDetalle === 'Pendiente' ||
        (order.estatusDetalle === 'En camino' && order.id === activeOrderId)
      );
    });

    console.log('Pedidos filtrados:', filteredOrders);
    return filteredOrders;
  } catch (error) {
    throw new Error(error.message || 'Error al conectar con la API');
  }
}

  async UpdateStatus(  id, estatusDetalle ) {
      try {
        const response = await fetch(this.apiUpdateStatusBaseUrl, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, estatusDetalle }),
        });
  
        if (!response.ok) {
          throw new Error('Datos invalidos o error en la API');
        }
  
        const data = await response.json();
  
        return data;
      } catch (error) {
        throw new Error(error.message || 'Error al conectar con la API');
      }
    }
}
