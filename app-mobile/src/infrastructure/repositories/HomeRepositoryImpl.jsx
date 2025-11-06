import HomeRepository from '../../domain/repositories/HomeRepository';
import Enterprise from '../../domain/entities/Enterprise';

export default class HomeRepositoryImpl extends HomeRepository {
  constructor() {
    super();
    this.apiEnterprisesBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Empresa';
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

  //async OrdersEnterprises() {
  //  try {
  //    const response = await fetch(this.apiEnterprisesBaseUrl, {
  //      method: 'GET',
  //      headers: { 'Content-Type': 'application/json' },
  //    });
//
  //    if (!response.ok) {
  //      throw new Error('Error al obtener los pedidos de las Empresas');
  //    }
//
  //    const OrdersEnterprises = await response.json();
//
  //    return OrdersEnterprises;
  //  } catch (error) {
  //    throw new Error(error.message || 'Error al conectar con la API');
  //  }
  //}
}
