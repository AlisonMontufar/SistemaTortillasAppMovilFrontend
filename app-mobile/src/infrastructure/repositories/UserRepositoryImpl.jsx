import UserRepository from '../../domain/repositories/UserRepository';
import User from '../../domain/entities/User';

export default class UserRepositoryImpl extends UserRepository {
  constructor() {
    super();
    this.apiLoginBaseUrl = 'http://192.168.100.10:5149/api/v1/Auth/login';
    this.apiRegisterBaseUrl = 'http://192.168.100.10:5149/api/v1/Auth/register';
  }

  async login(nombreUsuario, contrasenaUsuario) {
    try {
      const response = await fetch(`${this.apiLoginBaseUrl}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nombreUsuario, contrasenaUsuario }),
      });

      if (!response.ok) {
        throw new Error('Credenciales inválidas o error en la API');
      }

      const data = await response.json();

      // data debería tener { id, name, email } según tu API
      console.log(data);
      return new User(data.Username, data.RoleId, data.Token, data.ExpiresAt);
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
