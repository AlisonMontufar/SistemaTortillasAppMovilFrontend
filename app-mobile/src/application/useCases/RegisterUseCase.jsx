// src/application/useCases/RegisterUseCase.js
export default class RegisterUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(nombreUsuario, nombre, apellidoP, apellidoM, 
    correoUsuario, contrasenaUsuario, telefonoUsuario, placasVehiculo) {
    return await this.userRepository.register(nombreUsuario, nombre, apellidoP, apellidoM, 
    correoUsuario, contrasenaUsuario, telefonoUsuario, placasVehiculo);
  }
}
