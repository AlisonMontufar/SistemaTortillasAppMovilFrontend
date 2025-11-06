import UserRepository from '../../domain/repositories/UserRepository';
import User from '../../domain/entities/User';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default class UserRepositoryImpl extends UserRepository {
  constructor() {
    super();
    this.apiLoginBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Auth/login';
    this.apiRegisterBaseUrl = 'https://sistematortillasbackend-1.onrender.com/api/Auth/register';
  }

  async login(  Identificador, contrasenaUsuario) {
    try {
      const response = await fetch(`${this.apiLoginBaseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ Identificador, contrasenaUsuario }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o error en la API');
      }

      const data = await response.json();

      // data debería tener { id, name, email } según tu API
      console.log(data);
      return new User(data.username, data.roleId, data.token, data.expiresAt);
    } catch (error) {
      throw new Error(error.message || 'Error al conectar con la API');
    }
  }

  async register(nombreUsuario, nombre, apellidoP, apellidoM, correoUsuario, contrasenaUsuario,
     telefonoUsuario, placasVehiculo) {
    try {
      const response = await fetch(`${this.apiRegisterBaseUrl}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nombreUsuario, 
          nombre, 
          apellidoP, 
          apellidoM, 
          correoUsuario, 
          contrasenaUsuario,
          rol : 3,
          empresa : null,
          estatus: 1,
          telefonoUsuario, 
          placasVehiculo }),
      });

      if (!response.ok) {
        throw new Error('Error al registrar usuario');
      }

      const data = await response.json();
      console.log('Respuesta del backend (register):', data);

       // ✅ Devolvemos solo el mensaje
      return data.message || 'Registro exitoso';
    } catch (error) {
      throw new Error(error.message || 'Error al conectar con la API');
    }
  }
}
