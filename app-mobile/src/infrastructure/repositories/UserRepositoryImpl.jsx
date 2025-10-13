import UserRepository from '../../domain/repositories/UserRepository';
import User from '../../domain/entities/User';

export default class UserRepositoryImpl extends UserRepository {
  constructor() {
    super();
    this.apiLoginBaseUrl = 'http://192.168.100.10:5149/api/v1/Auth/login';
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
}
